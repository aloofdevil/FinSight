const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().trim().min(1).max(50).required(),
  icon: Joi.string().max(10).default('📦'),
  color: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).default('#6366f1')
});

const update = Joi.object({
  name: Joi.string().trim().min(1).max(50),
  icon: Joi.string().max(10),
  color: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/)
}).min(1);

module.exports = { create, update };
