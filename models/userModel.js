const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Prašom nurodyti vardą"],
    },
    email: {
      type: String,
      required: [true, "Prašom nurodyti email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Prašome nurodyti galiojantį email"],
    },
    role: {
      type: String,
      required: [true, "pasirinkite ar ieškote darbo ar siūlote darbą"],
      enum: ["ieškau darbo", "siūlau darba"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Slaptažodį turi sudaryti bent 8 simboliai"],
      select: false, // Butinai select: false, kad nesiustume response su PW
    },
    passwordConfirm: {
      type: String,
      required: [true, "Prašome patvirtinti slaptažodį"],
      validate: {
        // veikia tik ant create ir save, ne update
        validator: function (el) {
          return el === this.password;
        },
        message: "Slaptažodžiai nesutampa",
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // imone: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Darbdavio",
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(
    `siusim emailu: ${resetToken}, hashintas DB: ${this.passwordResetToken}`
  );
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
