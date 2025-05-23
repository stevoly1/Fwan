// will require userServices 
// will interact directly with res,req to implement the functions from userServices  



// will implement user creation logic
// will implement user login logic
// will implement user logout logic
// will implement the get profile logic
// will implement the profile update logic
// will implement the password update logic
// will implement the forgot password logic
// will implement the verify logic


// will exports all the controls to be used in the routes

const userServices = require('../services/userServices');
const { StatusCodes } = require("http-status-codes");



exports.completeRegistration = async (req, res, next) => {
    try {
        const result = await userServices.completeUserRegistration();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

exports.getProfile = async (req, res, next) => {
    const user = req.user;
    const targetId = req.params.id;
    try {
        const result = await userServices.getUserProfile( user, targetId );
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
exports.updateProfile = async (req, res, next) => {
    const id = req.params.id;
    try {
        const userData = {email:req.body.email, password: req.body.password,name: req.body.name};
        const result = await userServices.updateUserProfile(id, userData);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
exports.updatePassword = async (req, res, next) => {
    try {
        const result = await userServices.updateUserPassword();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
