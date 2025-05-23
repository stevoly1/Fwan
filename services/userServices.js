
// Get profile functions
// update profile functions
// update password functions


// all module will be exported for controller use

const {User,Farmer,Buyer }= require('../models/userModel');
const jwtTokenHelper = require('../utils/jwtTokenHelper');
const CustomError = require("../errors");
const emailSender = require("../utils/emailSender");



module.exports = {
  async completeUserRegistration() {
    return { msg: "onboard successful" };
  },

  async getUserProfile( user, targetId) {

    if (!targetId || !user) {
      throw new CustomError.BadRequestError("please provide a user profile to get");
    }
    const { userId } = user;

    // when a user is getting their profile, they should be able to get their own profile
    if (userId.toString() === targetId) {
      try {
        const user = await User.findById(targetId).select("-_id -__v").lean();
        if (!user) {
          throw new CustomError.NotFoundError("user not found");
        }
        return { user };
      } catch (error) {
        throw new CustomError.NotFoundError("could not fetch user profile");
      }
    }
    // when user (buyer or farmer are trying to view others profile)
    if (userId.toString() !== targetId) {
      try {
        const user = await User.findById(targetId).select("-_id -__v -updatedAt -email -phoneNumber -password").lean();
        if (!user) {
          throw new CustomError.NotFoundError("user not found");
        }
        return {
          user
        }
      } catch (error) {
        throw new CustomError.NotFoundError("could not fetch user profile ");
        
      }
      
    }
  },

  async updateUserProfile({ email, password, name }) {
    if (!email || !password || !name) {
      throw new Error("Please provide all values");
    }
    return { msg: "update profile successful", email, password, name };
  },

  async updateUserPassword(oldPassword,newPassword) {
    return { msg: "update password successful" };
  },
};


