const express = require('express');
const router = express.Router();
const PasswordResetController = require("./../controllers/PasswordResetController")
const AuthenticationController = require("./../controllers/AuthenticationController");
const auth = require('./../middlewares/Protect');

router.post('/login', AuthenticationController.login);

router.post('/forgot-password', PasswordResetController.forgotPassword);

router.patch('/reset-password/:token', PasswordResetController.resetPassword);

router.patch('/profile/update-password', auth.auth, PasswordResetController.updatePassword);

module.exports = router;