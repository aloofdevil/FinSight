const ApiError = require('../utils/ApiError');

const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    throw new ApiError(400, message);
  }
  req[source] = value;
  next();
};

module.exports = validate;
