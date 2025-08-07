const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateSettings: Joi.object({
    voice_preference: Joi.string().valid('male', 'female').optional(),
    content_frequency: Joi.number().min(1).max(10).optional(),
    preferred_platforms: Joi.array().items(Joi.string().valid('instagram', 'facebook', 'tiktok', 'whatsapp')).optional(),
    categories: Joi.array().items(Joi.string()).optional()
  }),

  createCampaign: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    products: Joi.array().items(Joi.number().integer()).required(),
    schedule_config: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'custom').required(),
      times: Joi.array().items(Joi.string()).required(),
      timezone: Joi.string().required()
    }).required(),
    social_platforms: Joi.array().items(Joi.string().valid('instagram', 'facebook', 'tiktok', 'whatsapp')).required(),
    content_settings: Joi.object({
      voice_preference: Joi.string().valid('male', 'female').required(),
      style: Joi.string().valid('modern', 'casual', 'professional').required(),
      include_hashtags: Joi.boolean().required()
    }).required()
  })
};

module.exports = {
  validateRequest,
  schemas
};