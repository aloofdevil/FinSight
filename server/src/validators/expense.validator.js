const Joi = require('joi');

const create = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().hex().length(24).required(),
  description: Joi.string().trim().max(200).allow('').default(''),
  date: Joi.date().required(),
  type: Joi.string().valid('expense', 'income').default('expense')
});

const update = Joi.object({
  amount: Joi.number().positive(),
  category: Joi.string().hex().length(24),
  description: Joi.string().trim().max(200).allow(''),
  date: Joi.date(),
  type: Joi.string().valid('expense', 'income')
}).min(1);

const query = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  from: Joi.date(),
  to: Joi.date(),
  category: Joi.string().hex().length(24),
  type: Joi.string().valid('expense', 'income'),
  search: Joi.string().trim().max(100),
  sort: Joi.string().valid('date', 'amount', 'createdAt').default('date'),
  order: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = { create, update, query };
