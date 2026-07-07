const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) throw new ApiError(401, 'Not authenticated');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    throw new ApiError(401, 'Token expired or invalid');
  }
});

module.exports = auth;
