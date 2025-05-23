
const { User } = require('../models/userModel');
const Token = require('../models/tokenModel')
const jwtHelper = require("../utils/jwtTokenHelper");
const TokenUser = require('../utils/createTokenUser');
const crypto = require("crypto");
const CustomError = require("../errors");
const emailSender = require('../utils/emailSender')
const loginAlertService = require('../utils/loginAlertService')



module.exports = {
  async registerUser({ email, password, firstName, lastName }) {
    if (!email || !password || !firstName || !lastName) {
      throw new CustomError.BadRequestError("some fields are missing, please fill the form correctly to create an account with us");
    }
    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError(
        "An account with that email address already exists. Please log in or reset your password if you’ve forgotten it."
      );
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(emailVerificationToken)
      .digest("hex");

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      emailVerificationToken: hashedToken,
    });

    const origin = "http://localhost:3000";


    await emailSender.sendVerificationEmail({
      name: `${user.firstName}`,
      email: user.email,
      verificationToken: emailVerificationToken,
      origin,
    });


    return {
      msg: {
        success: true,
        message: "Success! Please check your email to verify account",
      },
      user: {
        name: `${user.firstName} ${user.lastName}`,
        id: user._id,
        email: user.email,
        emailVerificationToken: emailVerificationToken,
      },
    };
  },

  async verifyUserEmail({ verificationToken, email }) {

    const user = await User.findOne({ email }).select('+emailVerificationToken');

    if (!user) {
      throw new CustomError.UnauthenticatedError("Verification Failed:user with this email doest not exist");
    }
    if (user.isEmailVerified) {
      return {
        msg: "Email has already been verified"
      };
    }
    const unHashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    if (user.emailVerificationToken !== unHashedToken) {
      throw new CustomError.UnauthenticatedError(
        "Verification Failed:the verification token is not valid"
      );
    }

    (user.isEmailVerified = true), (user.emailVerificationDate = Date.now());
    user.emailVerificationToken = "";

    await user.save();

    return {
      msg: {
        success: true,
        message: "Success! Email confirmed successfully",
      },
      user: {
        name: `${user.firstName} ${user.lastName}`,
        id: user._id,
        email: user.email,
        verification: user.isEmailVerified
      },
    };
  },

  async loginUser(req, res, userData) {

    const { email, password } = userData;

    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new CustomError.UnauthenticatedError("an account with this email,does not exist");
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials: you have entered an incorrect password");
    }
    if (!user.isEmailVerified) {
      throw new CustomError.UnauthenticatedError("Please verify your email");
    }

    const tokenUser = await TokenUser.createTokenUser(user);

    let refreshToken = '';

    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
      const { isValid } = existingToken
      if (!isValid) {
        throw new CustomError.UnauthenticatedError("unauthenticated user Invalid Credentials, please login");

      }
      refreshToken = existingToken.refreshToken;

      const accessTokenJWT = await jwtHelper.addCookiesToResponse( res, {user:tokenUser}, refreshToken );


      const now = new Date();
      const formattedTime = now.toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
        hour12: true,
      });

      const info = {
        ip: req.ip,
        time: formattedTime,
        userAgent: req.headers["user-agent"] || "n/a",
      };

      await loginAlertService
        .sendLoginAlert(user.lastName, user.email, info)
        .catch((err) => console.error("Login alert failed:", err));



      return {
        msg: { success: true, message: "user logged in successfully" },
        user: tokenUser,
        token: accessTokenJWT,
      };

    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    await Token.create(userToken);

    const token = await jwtHelper.addCookiesToResponse(
      res,
      {user: tokenUser },
      refreshToken
    );

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      hour12: true,
    });

    const info = {
      ip: req.ip,
      time: formattedTime,
      userAgent: req.headers["user-agent"] || "n/a",
    };

    await loginAlertService.sendLoginAlert(user.lastName, user.email, info).catch((err) => console.error("Login alert failed:", err));


    return {
      msg: {
        success: true,
        message: "user logged in successfully"
      },
      user: tokenUser,
      token
    }

  },

  async logoutUser(res, user) {
   
    const {userId} = user;
    if (!userId) {
      throw new CustomError.UnauthenticatedError("user not found");
    }

    await Token.findOneAndDelete({ user: userId });

    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    return {
      success: true,
      msg: "user logout successful"
    };
  },
  async forgotUserPassword(email) {
    if (!email) {
      throw new CustomError.BadRequestError('please input your email address to reset your password')
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.BadRequestError('failed! please check your email address');

    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");


    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ validateBeforeSave: false });

    const origin = "http://localhost:3000";

    await emailSender.sendResetPasswordEmail({
      name: user.firstName,
      email: user.email,
      passwordResetToken: resetToken,
      origin,
    });

    return {
      msg: {
        success: true,
        message: "If that email exists, we’ve sent a reset link",
      },
    };



  },
  async resetUserPassword({ res, resetData }) {
    const { token, email, newPassword } = resetData;
    if (!token || !email || !newPassword) {
      throw new CustomError.BadRequestError("please input reset data and new password")

    }
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email: email,
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }
    })

    if (!user) {
      throw new CustomError.NotFoundError("Token invalid or expired");

    }

    user.password = newPassword;
    user.passwordResetToken = "";
    user.passwordResetTokenExpires = "";

    await Token.findOneAndDelete({ user: user._id });

    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    await user.save();

    const origin = "http://localhost:3000";


    await emailSender.passwordResetSuccessEmail({
      name: user.firstName,
      email: user.email,
      origin,
    });

    return {
      msg: {
        success: true,
        message: "password reset was successful proceed to login your account"
      }
    }



  },
};