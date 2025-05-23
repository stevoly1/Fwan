const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



// Options for discriminatorKey
const options = {
  discriminatorKey: 'userType',
  collection: 'users',
  timestamps: true
};


const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
      minLength: [5, "Email must have 5 characters!"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password must be provided!"],
      trim: true,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      minLength: [3, "Name must have 3 characters!"],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [3, "Name must have 3 characters!"],
    },
    address: {
      type: String,
      trim: true,
      minLength: [5, "Address must have 5 characters!"],
    },
    phoneNumber: {
      type: Number,
      trim: true,
      minLength: [10, "Phone number must have 10 characters!"],
      maxLength: [15, "Phone number must have 15 characters!"],
    },
    isOnBoarded: {
      type: Boolean,
      default: false,
    },
    isKyc: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerificationCode: {
      type: String,
      select: false,
    },
    phoneVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  options
);

const farmerSchema = mongoose.Schema(
  {
    farmName: {
      type: String,
      trim: true,
      minLength: [5, "Farm name must have 5 characters!"],
    },
    farmLocation: {
      type: String,
      trim: true,
      minLength: [5, "Farm location must have 5 characters!"],
    },
    produceTypes: {
      type: [String],
      enum: ["vegetables", "fruits", "grains", "dairy", "meat"],
    },
  },

);
const buyerSchema = mongoose.Schema(
  {
    deliveryAddress: {
      type: String,
      trim: true,
      minLength: [5, "Delivery address must have 5 characters!"],
    },


  },

);

// hashing password before saving
userSchema.pre("save", async function (next) {
  // Only hash if the password field changed (or is new)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password method attached to userSchema
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);
const Farmer = User.discriminator("farmer", farmerSchema);
const Buyer = User.discriminator("buyer", buyerSchema);

module.exports = { User, Farmer, Buyer };


