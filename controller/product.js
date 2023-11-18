const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { validateId } = require("../utils/validateId");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.create({ ...req.body });
    res.json(product);
  } catch (e) {
    throw new Error(e);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (e) {
    throw new Error(e);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.json(product);
  } catch (e) {
    throw new Error(e);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).send("no product exists");
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json(updatedProduct);
  } catch (e) {
    throw new Error(e);
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const product = await Product.findByIdAndDelete(id);
    return res.json(product);
  } catch (e) {
    throw new Error(e);
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
