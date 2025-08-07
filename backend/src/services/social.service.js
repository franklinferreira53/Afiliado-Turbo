const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;
const { logger } = require('../utils/logger');

class SocialService {
  constructor() {
    this.facebookAppId = process.env.FACEBOOK_APP_ID;
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async publishToInstagram(accessToken, content, imageUrl = null) {
    try {
      let mediaId = null;

      // If there's an image, upload it first
      if (imageUrl) {
        const imageUploadResponse = await axios.post(
          `${this.baseUrl}/me/media`,
          {
            image_url: imageUrl,
            caption: content.fullPost || content.description,
            access_token: accessToken
          }
        );

        mediaId = imageUploadResponse.data.id;

        // Publish the media
        const publishResponse = await axios.post(
          `${this.baseUrl}/me/media_publish`,
          {
            creation_id: mediaId,
            access_token: accessToken
          }
        );

        return {
          success: true,
          platform: 'instagram',
          post_id: publishResponse.data.id,
          media_id: mediaId
        };
      } else {
        // Text-only post (Stories or other formats)
        const response = await axios.post(
          `${this.baseUrl}/me/feed`,
          {
            message: content.fullPost || content.description,
            access_token: accessToken
          }
        );

        return {
          success: true,
          platform: 'instagram',
          post_id: response.data.id
        };
      }
    } catch (error) {
      logger.error('Instagram publish error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async publishToFacebook(accessToken, pageId, content, imageUrl = null) {
    try {
      const postData = {
        message: content.fullPost || content.description,
        access_token: accessToken
      };

      // Add image if provided
      if (imageUrl) {
        postData.link = imageUrl;
      }

      const response = await axios.post(
        `${this.baseUrl}/${pageId}/feed`,
        postData
      );

      return {
        success: true,
        platform: 'facebook',
        post_id: response.data.id
      };
    } catch (error) {
      logger.error('Facebook publish error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async schedulePost(platform, content, scheduleTime, accessToken, pageId = null) {
    try {
      const scheduledTime = Math.floor(new Date(scheduleTime).getTime() / 1000);

      if (platform === 'facebook') {
        const response = await axios.post(
          `${this.baseUrl}/${pageId}/feed`,
          {
            message: content.fullPost || content.description,
            scheduled_publish_time: scheduledTime,
            published: false,
            access_token: accessToken
          }
        );

        return {
          success: true,
          platform: 'facebook',
          scheduled_post_id: response.data.id,
          scheduled_time: scheduleTime
        };
      }

      // Instagram scheduling would go here
      // Note: Instagram scheduling requires business accounts and additional setup

      throw new Error(`Scheduling not yet implemented for ${platform}`);
    } catch (error) {
      logger.error('Post scheduling error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async getPostAnalytics(platform, postId, accessToken) {
    try {
      let endpoint = '';
      let metrics = [];

      if (platform === 'instagram') {
        endpoint = `${this.baseUrl}/${postId}/insights`;
        metrics = ['reach', 'impressions', 'engagement'];
      } else if (platform === 'facebook') {
        endpoint = `${this.baseUrl}/${postId}/insights`;
        metrics = ['post_impressions', 'post_engaged_users', 'post_clicks'];
      }

      const response = await axios.get(endpoint, {
        params: {
          metric: metrics.join(','),
          access_token: accessToken
        }
      });

      return {
        success: true,
        platform,
        post_id: postId,
        analytics: this.parseAnalytics(response.data.data)
      };
    } catch (error) {
      logger.error('Analytics fetch error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  parseAnalytics(analyticsData) {
    const parsed = {};
    
    analyticsData.forEach(metric => {
      const name = metric.name;
      const value = metric.values?.[0]?.value || 0;
      parsed[name] = value;
    });

    return parsed;
  }

  async validateAccessToken(platform, accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: { access_token: accessToken }
      });

      return {
        valid: true,
        user_id: response.data.id,
        name: response.data.name
      };
    } catch (error) {
      logger.error('Token validation error:', error.response?.data || error.message);
      return {
        valid: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async getUserPages(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: { 
          access_token: accessToken,
          fields: 'id,name,access_token,category,tasks'
        }
      });

      return {
        success: true,
        pages: response.data.data
      };
    } catch (error) {
      logger.error('Get user pages error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Mock implementations for development
  async publishToTikTok(content, videoUrl = null) {
    // TikTok API integration would go here
    logger.info('TikTok publishing (mock):', { content, videoUrl });
    
    return {
      success: true,
      platform: 'tiktok',
      post_id: `tiktok_${Date.now()}`,
      note: 'Mock implementation - TikTok API not yet integrated'
    };
  }

  async publishToWhatsApp(content, contacts) {
    // WhatsApp Business API integration would go here
    logger.info('WhatsApp publishing (mock):', { content, contacts });
    
    return {
      success: true,
      platform: 'whatsapp',
      messages_sent: contacts.length,
      note: 'Mock implementation - WhatsApp Business API not yet integrated'
    };
  }

  getOptimalPostingTimes(platform, timezone = 'UTC') {
    const optimalTimes = {
      instagram: ['09:00', '11:00', '14:00', '17:00', '20:00'],
      facebook: ['09:00', '13:00', '15:00', '18:00', '21:00'],
      tiktok: ['06:00', '10:00', '16:00', '19:00', '22:00'],
      whatsapp: ['10:00', '14:00', '18:00', '21:00']
    };

    return optimalTimes[platform] || optimalTimes.instagram;
  }
}

module.exports = SocialService;