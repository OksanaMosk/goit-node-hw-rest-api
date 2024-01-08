const contacts = require("../models/contacts");
const { HttpError } = require("../helpers/index");
const { ctrlWrapper } = require("../helpers/ctrlWrapper");

const schemas = require("../schemas/contacts");

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.getById(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const { error } = schemas.addSchema.validate(req.body);

  if (error) {
    throw HttpError(400, "missing required name field");
  }
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};
const remove = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};
const update = async (req, res) => {
  const { error } = schemas.addSchema.validate(req.body);

  if (error) {
    throw HttpError(400, "missing fields");
  }
  const { id } = req.params;

  const result = await contacts.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
  update: ctrlWrapper(update),
};
