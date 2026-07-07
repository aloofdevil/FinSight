const authService = require('../services/auth.service');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  const tokens = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, tokens.refreshToken);
  authService.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email }
  });
});

const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  const tokens = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, tokens.refreshToken);
  authService.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email }
  });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const { user, accessToken, refreshToken: newRefresh } = await authService.refreshTokens(refreshToken);
  authService.setTokenCookies(res, accessToken, newRefresh);

  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email }
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken && req.user) {
    await authService.logout(req.user.id, refreshToken);
  }

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.json({ success: true, message: 'Logged out' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email createdAt');
  res.json({ success: true, data: user });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If that email is registered, a reset link has been sent',
    emailSent: result.sent,
    resetToken: result.resetToken
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await authService.resetPassword(token, password);
  const tokens = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, tokens.refreshToken);
  authService.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email }
  });
});

module.exports = { register, login, refresh, logout, getMe, forgotPassword, resetPassword };
