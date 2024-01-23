const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const {
  authenticate,
  isValidId,
  validateBody,
  validateByUpdate,
} = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", authenticate, isValidId, ctrl.remove);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.update
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateByUpdate(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
