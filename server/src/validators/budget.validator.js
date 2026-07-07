const Joi = require('joi');

const create = Joi.object({
  categoryId: Joi.string().hex().length(24).required(),
  monthlyLimit: Joi.number().positive().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2020).max(2100).required()
});

const update = Joi.object({
  monthlyLimit: Joi.number().positive().required()
});

module.exports = { create, update };
