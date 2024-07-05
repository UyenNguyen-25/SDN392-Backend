require("dotenv").config();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const login = asyncHandler(async (req, res) => {
  const { user_phoneNumber, user_password } = req.body;

  if (!user_phoneNumber || !user_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ user_phoneNumber })
    .populate("user_role", "role_description-_id")
    .lean();

  if (!foundUser || foundUser.user_status === false) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(user_password, foundUser?.user_password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        user_phoneNumber: foundUser.user_phoneNumber,
        user_fullname: foundUser.user_fullname,
        user_role: foundUser?.user_role,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const refreshToken = jwt.sign(
    { user_phoneNumber: foundUser.user_phoneNumber },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "none", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  console.log("req.cookies: ", req.cookies);

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    console.log("decoded: ", decoded);

    const foundUser = await User.findOne({
      user_phoneNumber: decoded.user_phoneNumber,
    })
      .populate("user_role", "role_description-_id")
      .lean();

    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          user_phoneNumber: foundUser.user_phoneNumber,
          user_fullname: foundUser.user_fullname,
          user_role: foundUser?.user_role,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { user_phoneNumber, user_password } = req.body;

  //confirm data
  if (!user_phoneNumber) {
    return res.status(400).json({ message: "id is required" });
  }

  const foundUser = await User.findOne({
    user_phoneNumber,
  }).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "User not found" });
  }

  //hash password
  if (user_password && user_password.length > 0) {
    foundUser.user_password = await bcrypt.hash(user_password, 10);
  }

  await foundUser.save();

  res.status(200).json({
    message: `${user_phoneNumber} updated success`,
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
});

module.exports = { login, refresh, forgotPassword, logout };
