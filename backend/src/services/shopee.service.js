const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

class ShopeeService {
  constructor() {
    this.partnerId = process.env.SHOPEE_PARTNER_ID;
    this.partnerKey = process.env.SHOPEE_PARTNER_KEY;
    this.baseUrl = 'https://partner.shopeemobile.com/api/v1';
  }

  generateSignature(path, timestamp) {
    const baseString = `${this.partnerId}${path}${timestamp}`;
    return crypto
      .createHmac('sha256', this.partnerKey)
      .update(baseString)
      .digest('hex');
  }

  async searchProducts(keyword, limit = 10) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = '/product/search';
      const sign = this.generateSignature(path, timestamp);

      const params = {
        partner_id: this.partnerId,
        timestamp,
        sign,
        keyword,
        page_size: limit,
        page_no: 1
      };

      const response = await axios.get(`${this.baseUrl}${path}`, { params });
      
      if (response.data.error) {
        logger.error('Shopee API error:', response.data.error);
        return [];
      }

      return this.parseShopeeResponse(response.data.products || []);
    } catch (error) {
      logger.error('Shopee API error:', error.response?.data || error.message);
      return [];
    }
  }

  parseShopeeResponse(products) {
    return products.map(product => ({
      title: product.name || 'Unknown Product',
      description: product.description || '',
      price: (product.price_min || 0) / 100000, // Convert from Shopee format
      original_price: (product.price_max || 0) / 100000,
      image_url: product.images?.[0] || '',
      product_url: `https://shopee.com.br/product/${product.shopid}/${product.itemid}`,
      affiliate_link: this.generateAffiliateLink(product.shopid, product.itemid),
      source: 'shopee',
      category: product.tier_variations?.[0]?.name || 'general',
      rating: (product.item_rating?.rating_star || 0) / 20, // Convert to 5-star scale
      reviews_count: product.item_rating?.rating_count?.[0] || 0,
      popularity_score: this.calculatePopularityScore(product)
    }));
  }

  calculatePopularityScore(product) {
    const sales = product.historical_sold || 0;
    const rating = (product.item_rating?.rating_star || 0) / 20;
    const reviews = product.item_rating?.rating_count?.[0] || 0;
    
    // Weighted scoring algorithm
    return Math.floor((sales * 0.5) + (rating * 20) + (reviews * 0.3));
  }

  generateAffiliateLink(shopId, itemId) {
    // This would include your Shopee affiliate parameters
    return `https://shopee.com.br/product/${shopId}/${itemId}?affiliate_id=${this.partnerId}`;
  }

  async getTrendingProducts() {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = '/product/trending';
      const sign = this.generateSignature(path, timestamp);

      const params = {
        partner_id: this.partnerId,
        timestamp,
        sign,
        page_size: 20
      };

      const response = await axios.get(`${this.baseUrl}${path}`, { params });
      
      if (response.data.error) {
        logger.error('Shopee trending API error:', response.data.error);
        return [];
      }

      return this.parseShopeeResponse(response.data.products || []);
    } catch (error) {
      logger.error('Shopee trending API error:', error);
      // Return mock data for development
      return this.getMockTrendingProducts();
    }
  }

  getMockTrendingProducts() {
    return [
      {
        title: 'Smartphone Android 64GB',
        description: 'Smartphone com ótimo custo-benefício',
        price: 299.99,
        original_price: 399.99,
        image_url: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Smartphone',
        product_url: 'https://shopee.com.br/product/mock/1',
        affiliate_link: 'https://shopee.com.br/product/mock/1?affiliate_id=mock',
        source: 'shopee',
        category: 'electronics',
        rating: 4.5,
        reviews_count: 1250,
        popularity_score: 85
      },
      {
        title: 'Fones de Ouvido Bluetooth',
        description: 'Fones sem fio com cancelamento de ruído',
        price: 79.99,
        original_price: 129.99,
        image_url: 'https://via.placeholder.com/300x300/374151/ffffff?text=Fones',
        product_url: 'https://shopee.com.br/product/mock/2',
        affiliate_link: 'https://shopee.com.br/product/mock/2?affiliate_id=mock',
        source: 'shopee',
        category: 'electronics',
        rating: 4.2,
        reviews_count: 876,
        popularity_score: 78
      }
    ];
  }
}

module.exports = ShopeeService;