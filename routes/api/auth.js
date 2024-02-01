const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");

const { schemas } = require("../../models/user");
const {
  authenticate,
  validateBody,
  validateSubscription,
} = require("../../middlewares");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/verify/:verificationToken", ctrl.verify);
router.post(
  "/verify/",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);
router.patch(
  "/",
  authenticate,
  validateSubscription(schemas.subscriptionSchema),
  ctrl.subscription
);

module.exports = router;
