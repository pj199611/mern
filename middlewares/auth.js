const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req?.headers?.authorization?.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (e) {
      throw new Error("Not authorized token expired .Please login again");
    }
  } else {
    throw new Error("There is no token attached");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role !== "admin") {
    throw new Error("you are not admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
