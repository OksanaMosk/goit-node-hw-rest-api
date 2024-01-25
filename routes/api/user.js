const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");
const {
  authenticate,
  validateBody,
  validateSubscription,
  upload,
} = require("../../middlewares");

router.get("/avatars", authenticate, ctrl.getAvatar);

router.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  ctrl.uploadAvatar
);

module.exports = router;
