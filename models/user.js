const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: ObjectId,
      ref: "Address",
    },
    wishlist: {
      type: ObjectId,
      ref: "Product",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSaltSync(19);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
