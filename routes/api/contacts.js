const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const isValidId = require("../../middlewares/isValidId");
const { validateBody } = require("../../middlewares");
const { validateByUpdate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", isValidId, ctrl.remove);

router.put("/:id", isValidId, validateBody(schemas.addSchema), ctrl.update);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateByUpdate(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
