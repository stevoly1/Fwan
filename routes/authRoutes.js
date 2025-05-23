

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const protected = require('../middlewares/authentication');





router.route('/register').post(authController.register);
router.route("/verify-email").get(authController.verifyEmail);
router.route('/login').post(authController.login);
router.route('/logout').delete(protected.protect, authController.logout);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-Password').post(authController.resetPassword);




module.exports = router;


