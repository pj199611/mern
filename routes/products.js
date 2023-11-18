const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/auth");

router.get("/get-all-products", getAllProducts);
router.get("/:id", getProduct);
router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
