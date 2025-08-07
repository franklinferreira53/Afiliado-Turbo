const { query } = require('../config/database');
const { logger } = require('../utils/logger');

class AnalyticsService {
  async trackClick(userId, productId, contentId, source, metadata = {}) {
    try {
      await query(
        `INSERT INTO analytics_events (
          user_id, product_id, content_id, event_type, source, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, productId, contentId, 'click', source, JSON.stringify(metadata)]
      );
      
      logger.info(`Click tracked: User ${userId}, Product ${productId}, Source ${source}`);
    } catch (error) {
      logger.error('Click tracking error:', error);
    }
  }

  async trackView(userId, productId, contentId, source, viewDuration = null) {
    try {
      const metadata = viewDuration ? { duration: viewDuration } : {};
      
      await query(
        `INSERT INTO analytics_events (
          user_id, product_id, content_id, event_type, source, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, productId, contentId, 'view', source, JSON.stringify(metadata)]
      );
      
      logger.info(`View tracked: User ${userId}, Product ${productId}, Source ${source}`);
    } catch (error) {
      logger.error('View tracking error:', error);
    }
  }

  async trackConversion(userId, productId, contentId, conversionValue, source) {
    try {
      await query(
        `INSERT INTO analytics_events (
          user_id, product_id, content_id, event_type, source, conversion_value, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, productId, contentId, 'conversion', source, conversionValue]
      );
      
      logger.info(`Conversion tracked: User ${userId}, Product ${productId}, Value ${conversionValue}`);
    } catch (error) {
      logger.error('Conversion tracking error:', error);
    }
  }

  async getDashboardStats(userId, dateRange = '30d') {
    try {
      const whereClause = this.buildDateRangeClause(dateRange);
      
      // Total clicks
      const clicksResult = await query(
        `SELECT COUNT(*) as total_clicks FROM analytics_events 
         WHERE user_id = $1 AND event_type = 'click' ${whereClause}`,
        [userId]
      );

      // Total views
      const viewsResult = await query(
        `SELECT COUNT(*) as total_views FROM analytics_events 
         WHERE user_id = $1 AND event_type = 'view' ${whereClause}`,
        [userId]
      );

      // Total conversions and revenue
      const conversionsResult = await query(
        `SELECT COUNT(*) as total_conversions, COALESCE(SUM(conversion_value), 0) as total_revenue
         FROM analytics_events 
         WHERE user_id = $1 AND event_type = 'conversion' ${whereClause}`,
        [userId]
      );

      // Click-through rate
      const totalClicks = parseInt(clicksResult.rows[0].total_clicks);
      const totalViews = parseInt(viewsResult.rows[0].total_views);
      const ctr = totalViews > 0 ? (totalClicks / totalViews * 100) : 0;

      // Conversion rate
      const totalConversions = parseInt(conversionsResult.rows[0].total_conversions);
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;

      return {
        total_clicks: totalClicks,
        total_views: totalViews,
        total_conversions: totalConversions,
        total_revenue: parseFloat(conversionsResult.rows[0].total_revenue),
        ctr: parseFloat(ctr.toFixed(2)),
        conversion_rate: parseFloat(conversionRate.toFixed(2))
      };
    } catch (error) {
      logger.error('Dashboard stats error:', error);
      throw error;
    }
  }

  async getTopPerformingProducts(userId, limit = 10, dateRange = '30d') {
    try {
      const whereClause = this.buildDateRangeClause(dateRange);
      
      const result = await query(
        `SELECT 
          p.id, p.title, p.price, p.source,
          COUNT(CASE WHEN ae.event_type = 'click' THEN 1 END) as clicks,
          COUNT(CASE WHEN ae.event_type = 'view' THEN 1 END) as views,
          COUNT(CASE WHEN ae.event_type = 'conversion' THEN 1 END) as conversions,
          COALESCE(SUM(CASE WHEN ae.event_type = 'conversion' THEN ae.conversion_value END), 0) as revenue
         FROM products p
         LEFT JOIN analytics_events ae ON p.id = ae.product_id AND ae.user_id = $1 ${whereClause}
         WHERE EXISTS (SELECT 1 FROM analytics_events WHERE product_id = p.id AND user_id = $1 ${whereClause})
         GROUP BY p.id, p.title, p.price, p.source
         ORDER BY clicks DESC, revenue DESC
         LIMIT $2`,
        [userId, limit]
      );

      return result.rows.map(row => ({
        ...row,
        clicks: parseInt(row.clicks),
        views: parseInt(row.views),
        conversions: parseInt(row.conversions),
        revenue: parseFloat(row.revenue),
        ctr: row.views > 0 ? parseFloat((row.clicks / row.views * 100).toFixed(2)) : 0,
        conversion_rate: row.clicks > 0 ? parseFloat((row.conversions / row.clicks * 100).toFixed(2)) : 0
      }));
    } catch (error) {
      logger.error('Top performing products error:', error);
      throw error;
    }
  }

  async getPerformanceByPlatform(userId, dateRange = '30d') {
    try {
      const whereClause = this.buildDateRangeClause(dateRange);
      
      const result = await query(
        `SELECT 
          source,
          COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
          COUNT(CASE WHEN event_type = 'view' THEN 1 END) as views,
          COUNT(CASE WHEN event_type = 'conversion' THEN 1 END) as conversions,
          COALESCE(SUM(CASE WHEN event_type = 'conversion' THEN conversion_value END), 0) as revenue
         FROM analytics_events 
         WHERE user_id = $1 ${whereClause}
         GROUP BY source
         ORDER BY clicks DESC`,
        [userId]
      );

      return result.rows.map(row => ({
        platform: row.source,
        clicks: parseInt(row.clicks),
        views: parseInt(row.views),
        conversions: parseInt(row.conversions),
        revenue: parseFloat(row.revenue),
        ctr: row.views > 0 ? parseFloat((row.clicks / row.views * 100).toFixed(2)) : 0,
        conversion_rate: row.clicks > 0 ? parseFloat((row.conversions / row.clicks * 100).toFixed(2)) : 0
      }));
    } catch (error) {
      logger.error('Performance by platform error:', error);
      throw error;
    }
  }

  async getTimeSeriesData(userId, metric = 'clicks', dateRange = '30d', interval = 'day') {
    try {
      let dateFormat, dateInterval;
      
      switch (interval) {
        case 'hour':
          dateFormat = 'YYYY-MM-DD HH24:00:00';
          dateInterval = '1 hour';
          break;
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          dateInterval = '1 day';
          break;
        case 'week':
          dateFormat = 'YYYY-"W"WW';
          dateInterval = '1 week';
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          dateInterval = '1 month';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
          dateInterval = '1 day';
      }

      const whereClause = this.buildDateRangeClause(dateRange);
      let aggregateFunction = 'COUNT(*)';
      
      if (metric === 'revenue') {
        aggregateFunction = 'COALESCE(SUM(conversion_value), 0)';
      }

      const result = await query(
        `SELECT 
          TO_CHAR(created_at, '${dateFormat}') as date,
          ${aggregateFunction} as value
         FROM analytics_events 
         WHERE user_id = $1 
         ${metric !== 'revenue' ? `AND event_type = '${metric.slice(0, -1)}'` : `AND event_type = 'conversion'`}
         ${whereClause}
         GROUP BY TO_CHAR(created_at, '${dateFormat}')
         ORDER BY date`,
        [userId]
      );

      return result.rows.map(row => ({
        date: row.date,
        value: metric === 'revenue' ? parseFloat(row.value) : parseInt(row.value)
      }));
    } catch (error) {
      logger.error('Time series data error:', error);
      throw error;
    }
  }

  buildDateRangeClause(dateRange) {
    switch (dateRange) {
      case '24h':
        return "AND created_at >= NOW() - INTERVAL '24 hours'";
      case '7d':
        return "AND created_at >= NOW() - INTERVAL '7 days'";
      case '30d':
        return "AND created_at >= NOW() - INTERVAL '30 days'";
      case '90d':
        return "AND created_at >= NOW() - INTERVAL '90 days'";
      case '1y':
        return "AND created_at >= NOW() - INTERVAL '1 year'";
      default:
        return "AND created_at >= NOW() - INTERVAL '30 days'";
    }
  }

  async getContentPerformance(userId, contentId = null, dateRange = '30d') {
    try {
      const whereClause = this.buildDateRangeClause(dateRange);
      let contentFilter = '';
      let params = [userId];
      
      if (contentId) {
        contentFilter = 'AND ae.content_id = $2';
        params.push(contentId);
      }

      const result = await query(
        `SELECT 
          c.id, c.title, c.type, c.created_at,
          COUNT(CASE WHEN ae.event_type = 'click' THEN 1 END) as clicks,
          COUNT(CASE WHEN ae.event_type = 'view' THEN 1 END) as views,
          COUNT(CASE WHEN ae.event_type = 'conversion' THEN 1 END) as conversions,
          COALESCE(SUM(CASE WHEN ae.event_type = 'conversion' THEN ae.conversion_value END), 0) as revenue
         FROM content c
         LEFT JOIN analytics_events ae ON c.id = ae.content_id ${whereClause} ${contentFilter}
         WHERE c.user_id = $1
         GROUP BY c.id, c.title, c.type, c.created_at
         ORDER BY clicks DESC`,
        params
      );

      return result.rows.map(row => ({
        ...row,
        clicks: parseInt(row.clicks),
        views: parseInt(row.views),
        conversions: parseInt(row.conversions),
        revenue: parseFloat(row.revenue),
        ctr: row.views > 0 ? parseFloat((row.clicks / row.views * 100).toFixed(2)) : 0,
        conversion_rate: row.clicks > 0 ? parseFloat((row.conversions / row.clicks * 100).toFixed(2)) : 0
      }));
    } catch (error) {
      logger.error('Content performance error:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;