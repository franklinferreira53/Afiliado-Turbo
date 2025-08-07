const Content = require('../models/Content');
const Product = require('../models/Product');
const AIService = require('../services/ai.service');
const { logger } = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

const aiService = new AIService();

const generateContent = async (req, res) => {
  try {
    const { product_id, type, platform = 'instagram', style = 'modern' } = req.body;

    if (!product_id || !type) {
      return res.status(400).json({ error: 'Product ID and content type are required' });
    }

    // Get product details
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let generatedContent = {};

    switch (type) {
      case 'social_post':
        generatedContent = await aiService.generateSocialMediaPost(product, platform);
        break;

      case 'image':
        const imagePrompt = `${product.title} product showcase`;
        const imageResult = await aiService.generateImage(imagePrompt, style);
        
        if (imageResult.base64) {
          // Save image to file system
          const fileName = `generated_image_${Date.now()}.png`;
          const filePath = path.join(process.env.UPLOAD_PATH || './uploads', fileName);
          
          await fs.writeFile(filePath, imageResult.base64, 'base64');
          
          generatedContent = {
            image_url: `/uploads/${fileName}`,
            seed: imageResult.seed
          };
        } else {
          return res.status(500).json({ error: 'Failed to generate image' });
        }
        break;

      case 'video_script':
        const script = await aiService.generateVideoScript(product, 30);
        generatedContent = { script };
        break;

      case 'description':
        const description = await aiService.generateProductDescription(product, style);
        generatedContent = { description };
        break;

      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    // Save content to database
    const contentData = {
      user_id: req.user.id,
      product_id,
      type,
      title: `Generated ${type} for ${product.title}`,
      description: generatedContent.description || generatedContent.script || '',
      content_url: generatedContent.image_url || null,
      hashtags: generatedContent.hashtags || [],
      cta_text: generatedContent.cta || null,
      ai_generated_data: generatedContent,
      status: 'draft'
    };

    const savedContent = await Content.create(contentData);

    res.status(201).json({
      message: 'Content generated successfully',
      content: savedContent,
      generated_data: generatedContent
    });
  } catch (error) {
    logger.error('Content generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserContent = async (req, res) => {
  try {
    const { type, status, limit = 20 } = req.query;
    
    const filters = { limit: parseInt(limit) };
    if (type) filters.type = type;
    if (status) filters.status = status;

    const content = await Content.findByUserId(req.user.id, filters);

    res.json({
      content,
      count: content.length
    });
  } catch (error) {
    logger.error('Get user content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Ensure user owns this content
    if (content.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ content });
  } catch (error) {
    logger.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'approved', 'published', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // First check if content exists and user owns it
    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (content.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedContent = await Content.updateStatus(id, status);

    res.json({
      message: 'Content status updated successfully',
      content: updatedContent
    });
  } catch (error) {
    logger.error('Update content status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const regenerateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { style = 'modern' } = req.body;

    // Get existing content
    const existingContent = await Content.findById(id);
    if (!existingContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (existingContent.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get product details
    const product = await Product.findById(existingContent.product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let newGeneratedContent = {};

    // Regenerate based on content type
    switch (existingContent.type) {
      case 'social_post':
        newGeneratedContent = await aiService.generateSocialMediaPost(product);
        break;
      
      case 'image':
        const imagePrompt = `${product.title} product showcase`;
        const imageResult = await aiService.generateImage(imagePrompt, style);
        
        if (imageResult.base64) {
          const fileName = `regenerated_image_${Date.now()}.png`;
          const filePath = path.join(process.env.UPLOAD_PATH || './uploads', fileName);
          
          await fs.writeFile(filePath, imageResult.base64, 'base64');
          
          newGeneratedContent = {
            image_url: `/uploads/${fileName}`,
            seed: imageResult.seed
          };
        }
        break;
      
      case 'video_script':
        const script = await aiService.generateVideoScript(product, 30);
        newGeneratedContent = { script };
        break;
    }

    // Update the content with new generated data
    const updatedContent = await Content.updateStatus(id, 'draft');

    res.json({
      message: 'Content regenerated successfully',
      content: updatedContent,
      generated_data: newGeneratedContent
    });
  } catch (error) {
    logger.error('Regenerate content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  generateContent,
  getUserContent,
  getContentById,
  updateContentStatus,
  regenerateContent
};