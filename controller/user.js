const { generateToken } = require("../config/jwt");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { validateId } = require("../utils/validateId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

// create user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    console.log(newUser);
    return res.json(newUser);
  } else {
    throw new Error("user already exisits");
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    await User.findOneAndUpdate(
      { _id: findUser?.id },
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    return res.json({
      _id: findUser?._id,
      first_name: findUser?.first_name,
      last_name: findUser?.last_name,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (e) {
    throw new Error(e);
  }
});

// get one user
const getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const user = await User.findById(id);
    return res.json(user);
  } catch (e) {
    throw new Error(e);
  }
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const user = await User.findByIdAndDelete(id);
    return res.json(user);
  } catch (e) {
    throw new Error(e);
  }
});

// update user

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).send("no user exists");
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json(updatedUser);
  } catch (e) {
    throw new Error(e);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    return res.json(user);
  } catch (e) {
    throw new Error(e);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    return res.json(user);
  } catch (e) {
    throw new Error(e);
  }
});

//
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token");

  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("there is something wrong with refresh token!");
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("no cookie");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204);
  }

  await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.sendStatus(204);
});

module.exports = {
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
};
