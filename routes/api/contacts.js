const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const {
  isValidId,
  validateBody,
  validateByUpdate,
} = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", isValidId, ctrl.remove);

router.put("/:id", isValidId, validateBody(schemas.addSchema), ctrl.update);

router.patch(
  "/:id/favorite",
  isValidId,
  validateByUpdate(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
