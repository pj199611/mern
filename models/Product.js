const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Lenovo"],
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
