const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

class AmazonService {
  constructor() {
    this.accessKey = process.env.AMAZON_ACCESS_KEY;
    this.secretKey = process.env.AMAZON_SECRET_KEY;
    this.associateTag = process.env.AMAZON_ASSOCIATE_TAG;
    this.host = 'webservices.amazon.com';
    this.region = 'us-east-1';
    this.uri = '/paapi5/searchitems';
  }

  generateSignature(stringToSign) {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(stringToSign)
      .digest('base64');
  }

  async searchProducts(keywords, category = 'All') {
    try {
      const payload = {
        Keywords: keywords,
        SearchIndex: category,
        ItemCount: 10,
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.Features',
          'Offers.Listings.Price'
        ]
      };

      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        'Content-Encoding': 'amz-1.0'
      };

      // This is a simplified version - in production you'd implement full AWS v4 signing
      const response = await axios.post(
        `https://${this.host}${this.uri}`,
        payload,
        { headers }
      );

      return this.parseAmazonResponse(response.data);
    } catch (error) {
      logger.error('Amazon API error:', error.response?.data || error.message);
      return [];
    }
  }

  parseAmazonResponse(data) {
    if (!data.SearchResult?.Items) return [];

    return data.SearchResult.Items.map(item => ({
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
      description: item.ItemInfo?.Features?.DisplayValues?.join(', ') || '',
      price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      original_price: item.Offers?.Listings?.[0]?.SavingBasis?.Amount || 0,
      image_url: item.Images?.Primary?.Large?.URL || '',
      product_url: item.DetailPageURL || '',
      affiliate_link: this.generateAffiliateLink(item.ASIN),
      source: 'amazon',
      category: 'general',
      rating: 4.0, // Default rating since it's not always available
      reviews_count: 0,
      popularity_score: Math.floor(Math.random() * 100) // Simplified scoring
    }));
  }

  generateAffiliateLink(asin) {
    return `https://www.amazon.com/dp/${asin}/?tag=${this.associateTag}`;
  }

  async getViralProducts() {
    const categories = ['Electronics', 'Home', 'Sports', 'Beauty', 'Toys'];
    const allProducts = [];

    for (const category of categories) {
      const products = await this.searchProducts('bestseller', category);
      allProducts.push(...products);
    }

    // Sort by popularity score
    return allProducts
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, 20);
  }
}

module.exports = AmazonService;