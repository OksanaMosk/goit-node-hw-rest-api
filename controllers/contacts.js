const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const mongoose = require("mongoose");

const { Contact } = require("../models/contact");

const getAll = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const { favorite = true } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find(
    { owner, favorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
      favorite,
    }
  ).populate("owner", " email");
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const validObjectId = new mongoose.Types.ObjectId(id);
  const result = await Contact.findById(validObjectId);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const { id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const update = async (req, res) => {
  const { id } = req.params;

  const validObjectId = new mongoose.Types.ObjectId(id);

  const result = await Contact.findByIdAndUpdate(validObjectId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const validObjectId = new mongoose.Types.ObjectId(id);
  const result = await Contact.findByIdAndUpdate(validObjectId, req.body, {
    new: true,
  });
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
  update: ctrlWrapper(update),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
