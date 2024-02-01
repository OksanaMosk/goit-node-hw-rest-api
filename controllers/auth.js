const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const sendEmail = require("../helpers/sendEmail");
const { v4: uuidv4 } = require("uuid");
const crypto = require("node:crypto");
require("dotenv").config();

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const verificationToken = crypto.randomUUID();

  await sendEmail({
    from: "ksenjap124@gmail.com",
    to: email,
    subject: "Welcome to your contacts ",
    html: `To confirm your registration please click on the<a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
    text: `To confirm your registration please click on the<a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
  });

  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    verificationToken,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    email: newUser.email,
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const veryfyEmail = {
    from: "ksenjap124@gmail.com",
    to: email,
    subject: "Welcome to your contacts ",
    html: `To confirm your registration please click on the<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
    text: `To confirm your registration please click on the<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
  };
  await sendEmail(veryfyEmail);
  res.json({ message: " Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    console.log("Entered password:", password);
    console.log("User password:", user.password);
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.verify === false) {
    return res.status(401).send({ message: "???Your account is not verified" });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "96h",
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.json(email);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "Logout success" });
};

const subscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(result);
};

module.exports = {
  verify: ctrlWrapper(verify),
  register: ctrlWrapper(register),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
};
