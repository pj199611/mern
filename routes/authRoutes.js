const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
} = require("../controller/user");

const { authMiddleware, isAdmin } = require("../middlewares/auth");

const router = express.Router();
// refresh token
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

// main routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

// block user
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
