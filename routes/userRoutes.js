// will require userController
// will feed the /me route with the getProfile function from userController .GET
// will feed the /me route with the updateProfile function from userController .PATCH
// will feed the /updatePassword route with the updatePassword function from userController .PATCH

// will exports all the routes to be used in the app.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protected = require('../middlewares/authentication');


router.route("/complete-registration").post(protected.protect,userController.completeRegistration);
router.route('/:id').get(protected.protect,userController.getProfile).patch(protected.protect,userController.updateProfile);
router.route("/updatePassword").patch(protected.protect,userController.updatePassword);





module.exports = router;    