const fs = require("node:fs/promises");
const { ctrlWrapper } = require("../helpers");
const path = require("node:path");
const gravatar = require("gravatar");
const { User } = require("../models/user");
const Jimp = require("jimp");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    if (user === null) {
      return res.status(404).send({ message: "User not Found" });
    }
    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not Found" });
    }

    res.sendFile(path.join(__dirname, "..", "public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const uploadAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250).writeAsync(resultUpload);
  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  uploadAvatar: ctrlWrapper(uploadAvatar),
  getAvatar: ctrlWrapper(getAvatar),
};
