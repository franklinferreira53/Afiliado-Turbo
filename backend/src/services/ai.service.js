const OpenAI = require('openai');
const axios = require('axios');
const { logger } = require('../utils/logger');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.stabilityApiKey = process.env.STABILITY_API_KEY;
  }

  async generateProductDescription(product, tone = 'professional') {
    try {
      const prompt = `
        Create a compelling product description for the following product:
        
        Product Name: ${product.title}
        Price: $${product.price}
        Source: ${product.source}
        
        Make it ${tone}, engaging, and optimized for social media marketing.
        Include call-to-action phrases and highlight benefits.
        Keep it under 150 words.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      logger.error('OpenAI description generation error:', error);
      return this.getFallbackDescription(product);
    }
  }

  async generateHashtags(product, platform = 'instagram') {
    try {
      const prompt = `
        Generate relevant hashtags for this product for ${platform}:
        
        Product: ${product.title}
        Category: ${product.category}
        Price: $${product.price}
        
        Generate 15-20 hashtags that are:
        - Relevant to the product
        - Popular but not oversaturated
        - Mix of broad and specific tags
        - Optimized for ${platform}
        
        Return only the hashtags separated by spaces, starting with #
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.8
      });

      const hashtags = completion.choices[0].message.content.trim();
      return hashtags.split(' ').filter(tag => tag.startsWith('#'));
    } catch (error) {
      logger.error('Hashtag generation error:', error);
      return this.getFallbackHashtags(product);
    }
  }

  async generateCTA(product, platform = 'instagram') {
    try {
      const prompt = `
        Create a compelling call-to-action for this product on ${platform}:
        
        Product: ${product.title}
        Price: $${product.price}
        
        Make it urgent, action-oriented, and platform-appropriate.
        Keep it under 30 words.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.7
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      logger.error('CTA generation error:', error);
      return this.getFallbackCTA(product);
    }
  }

  async generateImage(prompt, style = 'modern tech futuristic') {
    try {
      const fullPrompt = `${prompt}, ${style}, clean background, high quality, professional photography`;

      const response = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          text_prompts: [
            {
              text: fullPrompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 20,
          samples: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.stabilityApiKey}`
          }
        }
      );

      if (response.data.artifacts && response.data.artifacts.length > 0) {
        return {
          base64: response.data.artifacts[0].base64,
          seed: response.data.artifacts[0].seed
        };
      }

      throw new Error('No image generated');
    } catch (error) {
      logger.error('Image generation error:', error);
      return {
        base64: null,
        error: error.message
      };
    }
  }

  async generateVideoScript(product, duration = 30) {
    try {
      const prompt = `
        Create a ${duration}-second video script for this product:
        
        Product: ${product.title}
        Description: ${product.description}
        Price: $${product.price}
        
        The script should:
        - Hook viewers in the first 3 seconds
        - Highlight key benefits
        - Create urgency
        - End with a strong call-to-action
        - Be conversational and engaging
        
        Format as: [Scene description] Narration text
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      logger.error('Video script generation error:', error);
      return this.getFallbackVideoScript(product);
    }
  }

  async generateSocialMediaPost(product, platform = 'instagram') {
    try {
      const [description, hashtags, cta] = await Promise.all([
        this.generateProductDescription(product, 'casual'),
        this.generateHashtags(product, platform),
        this.generateCTA(product, platform)
      ]);

      return {
        description,
        hashtags,
        cta,
        fullPost: `${description}\n\n${cta}\n\n${hashtags.join(' ')}`
      };
    } catch (error) {
      logger.error('Social media post generation error:', error);
      return this.getFallbackSocialPost(product);
    }
  }

  // Fallback methods for when AI services are unavailable
  getFallbackDescription(product) {
    return `🔥 Incredible deal on ${product.title}! Don't miss out on this amazing opportunity to get quality products at unbeatable prices. Limited time offer - act fast! 💯`;
  }

  getFallbackHashtags(product) {
    const baseHashtags = ['#deal', '#shopping', '#affiliate', '#discount', '#sale', '#online', '#product'];
    const categoryHashtags = product.category ? [`#${product.category.toLowerCase()}`] : [];
    return [...baseHashtags, ...categoryHashtags];
  }

  getFallbackCTA(product) {
    return "🛒 Click the link to grab yours now! Limited time offer!";
  }

  getFallbackVideoScript(product) {
    return `[Product showcase] Check out this amazing ${product.title}! [Benefits highlight] At just $${product.price}, this is a steal! [Call to action] Don't wait - get yours today!`;
  }

  getFallbackSocialPost(product) {
    const description = this.getFallbackDescription(product);
    const hashtags = this.getFallbackHashtags(product);
    const cta = this.getFallbackCTA(product);

    return {
      description,
      hashtags,
      cta,
      fullPost: `${description}\n\n${cta}\n\n${hashtags.join(' ')}`
    };
  }
}

module.exports = AIService;