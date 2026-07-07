const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const { DEFAULT_CATEGORIES } = require('../utils/constants');
const emailService = require('./email.service');

const generateTokens = (user) => {
  const payload = { id: user._id, email: user.email };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  // Seed default categories for this user
  const defaultCats = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    userId: user._id,
    isDefault: true
  }));
  await Category.insertMany(defaultCats);

  // Also create "Uncategorized" for reassignment
  await Category.create({
    userId: user._id,
    name: 'Uncategorized',
    icon: '?',
    color: '#9ca3af',
    isDefault: true
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  return user;
};

const refreshTokens = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, 'No refresh token');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new ApiError(401, 'Refresh token revoked');
  }

  // Rotate: remove old, issue new
  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save();

  return { user, ...tokens };
};

const saveRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    $push: { refreshTokens: refreshToken }
  });
};

const logout = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: refreshToken }
  });
};

const crypto = require('crypto');

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { sent: false, resetToken: null };

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
  const emailResult = await emailService.sendPasswordResetEmail({
    to: user.email,
    resetUrl
  });

  return {
    sent: emailResult.sent,
    resetToken: emailResult.sent ? null : resetToken
  };
};

const resetPassword = async (token, newPassword) => {
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  return user;
};

module.exports = {
  generateTokens,
  setTokenCookies,
  register,
  login,
  refreshTokens,
  saveRefreshToken,
  logout,
  forgotPassword,
  resetPassword
};
