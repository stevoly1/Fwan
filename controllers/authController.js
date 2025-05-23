


const authServices = require('../services/authServices');
const { StatusCodes } = require('http-status-codes');


exports.register = async (req, res, next) => {

  try {
    const userInput = { lastName: req.body.lastName, firstName: req.body.firstName, email: req.body.email, password: req.body.password };
    const result = await authServices.registerUser(userInput);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }

}


exports.verifyEmail = async (req, res, next) => {

  try {
    const reqData = {
      verificationToken: req.query.verificationToken,
      email: req.query.email,
    };

    const result = await authServices.verifyUserEmail(reqData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const userData = { email: req.body.email, password: req.body.password };
    const result = await authServices.loginUser(req, res, userData);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const user = req.user;
  try {
    const result = await authServices.logoutUser(res, user);
    res.status(StatusCodes.OK).json(result);

  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const result = await authServices.forgotUserPassword(email);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    const resetData = { token: req.query.token, email: req.query.email, newPassword: req.body.newPassword };
    const result = await authServices.resetUserPassword(res, resetData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};