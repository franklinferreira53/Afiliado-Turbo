const Content = require('../models/Content');
const SocialService = require('../services/social.service');
const { logger } = require('../utils/logger');

const socialService = new SocialService();

const publishContent = async (req, res) => {
  try {
    const { content_id, platforms, schedule_time, access_tokens } = req.body;

    if (!content_id || !platforms || !platforms.length) {
      return res.status(400).json({ error: 'Content ID and platforms are required' });
    }

    // Get content details
    const content = await Content.findById(content_id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Ensure user owns this content
    if (content.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const publishResults = [];

    for (const platform of platforms) {
      const accessToken = access_tokens[platform];
      
      if (!accessToken) {
        publishResults.push({
          platform,
          success: false,
          error: 'Access token not provided'
        });
        continue;
      }

      let result;

      if (schedule_time && new Date(schedule_time) > new Date()) {
        // Schedule post for later
        result = await socialService.schedulePost(
          platform,
          JSON.parse(content.ai_generated_data || '{}'),
          schedule_time,
          accessToken,
          req.body.page_id // For Facebook pages
        );
      } else {
        // Publish immediately
        switch (platform) {
          case 'instagram':
            result = await socialService.publishToInstagram(
              accessToken,
              JSON.parse(content.ai_generated_data || '{}'),
              content.content_url
            );
            break;
            
          case 'facebook':
            result = await socialService.publishToFacebook(
              accessToken,
              req.body.page_id,
              JSON.parse(content.ai_generated_data || '{}'),
              content.content_url
            );
            break;
            
          case 'tiktok':
            result = await socialService.publishToTikTok(
              JSON.parse(content.ai_generated_data || '{}'),
              content.content_url
            );
            break;
            
          case 'whatsapp':
            result = await socialService.publishToWhatsApp(
              JSON.parse(content.ai_generated_data || '{}'),
              req.body.whatsapp_contacts || []
            );
            break;
            
          default:
            result = {
              success: false,
              error: `Unsupported platform: ${platform}`
            };
        }
      }

      publishResults.push({
        platform,
        ...result
      });
    }

    // Update content status if any publish was successful
    const anySuccess = publishResults.some(result => result.success);
    if (anySuccess) {
      await Content.updatePublishedData(content_id, {
        published_at: new Date().toISOString(),
        platforms: publishResults.filter(r => r.success).map(r => r.platform),
        results: publishResults
      });
    }

    res.json({
      message: 'Publishing completed',
      results: publishResults,
      success_count: publishResults.filter(r => r.success).length,
      total_count: publishResults.length
    });
  } catch (error) {
    logger.error('Content publishing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateSocialTokens = async (req, res) => {
  try {
    const { platform, access_token } = req.body;

    if (!platform || !access_token) {
      return res.status(400).json({ error: 'Platform and access token are required' });
    }

    const validationResult = await socialService.validateAccessToken(platform, access_token);

    res.json({
      platform,
      valid: validationResult.valid,
      ...(validationResult.valid ? {
        user_id: validationResult.user_id,
        name: validationResult.name
      } : {
        error: validationResult.error
      })
    });
  } catch (error) {
    logger.error('Token validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserPages = async (req, res) => {
  try {
    const { access_token } = req.query;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const pagesResult = await socialService.getUserPages(access_token);

    if (pagesResult.success) {
      res.json({
        pages: pagesResult.pages
      });
    } else {
      res.status(400).json({
        error: pagesResult.error
      });
    }
  } catch (error) {
    logger.error('Get user pages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostAnalytics = async (req, res) => {
  try {
    const { content_id } = req.params;
    const { platform, access_token } = req.query;

    if (!platform || !access_token) {
      return res.status(400).json({ error: 'Platform and access token are required' });
    }

    // Get content details
    const content = await Content.findById(content_id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Ensure user owns this content
    if (content.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get published data to find post ID
    const publishedData = content.published_data ? JSON.parse(content.published_data) : {};
    const publishResult = publishedData.results?.find(r => r.platform === platform);

    if (!publishResult || !publishResult.post_id) {
      return res.status(404).json({ error: 'Post not found on this platform' });
    }

    const analytics = await socialService.getPostAnalytics(
      platform,
      publishResult.post_id,
      access_token
    );

    res.json(analytics);
  } catch (error) {
    logger.error('Post analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getOptimalPostingTimes = async (req, res) => {
  try {
    const { platform, timezone = 'UTC' } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    const optimalTimes = socialService.getOptimalPostingTimes(platform, timezone);

    res.json({
      platform,
      timezone,
      optimal_times: optimalTimes,
      recommendation: `Best times to post on ${platform} are: ${optimalTimes.join(', ')}`
    });
  } catch (error) {
    logger.error('Optimal posting times error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const bulkPublish = async (req, res) => {
  try {
    const { content_ids, platforms, access_tokens, schedule_interval_minutes = 30 } = req.body;

    if (!content_ids || !content_ids.length || !platforms || !platforms.length) {
      return res.status(400).json({ error: 'Content IDs and platforms are required' });
    }

    const publishJobs = [];
    let scheduleTime = new Date();

    for (let i = 0; i < content_ids.length; i++) {
      const content_id = content_ids[i];
      
      // Stagger posts by the specified interval
      if (i > 0) {
        scheduleTime = new Date(scheduleTime.getTime() + (schedule_interval_minutes * 60 * 1000));
      }

      publishJobs.push({
        content_id,
        platforms,
        schedule_time: scheduleTime.toISOString(),
        access_tokens
      });
    }

    // In a production environment, you'd queue these jobs
    // For now, we'll return the scheduled jobs
    res.json({
      message: 'Bulk publishing scheduled',
      jobs: publishJobs,
      total_posts: content_ids.length * platforms.length,
      estimated_completion: scheduleTime.toISOString()
    });
  } catch (error) {
    logger.error('Bulk publish error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  publishContent,
  validateSocialTokens,
  getUserPages,
  getPostAnalytics,
  getOptimalPostingTimes,
  bulkPublish
};