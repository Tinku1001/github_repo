const Joi = require('joi');

const validateSearch = (req, res, next) => {
  const schema = Joi.object({
    keyword: Joi.string().min(1).max(100).required(),
    page: Joi.number().integer().min(1).max(100).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  req.query = value;
  next();
};

const validateGetRepositories = (req, res, next) => {
  const schema = Joi.object({
    keyword: Joi.string().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).max(100).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sortBy: Joi.string().valid('createdAt', 'stargazersCount', 'name').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  req.query = value;
  next();
};

module.exports = {
  validateSearch,
  validateGetRepositories
};