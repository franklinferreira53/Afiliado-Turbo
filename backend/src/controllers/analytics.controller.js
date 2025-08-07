const AnalyticsService = require('../services/analytics.service');
const { logger } = require('../utils/logger');

const analyticsService = new AnalyticsService();

const trackEvent = async (req, res) => {
  try {
    const { event_type, product_id, content_id, source, conversion_value, metadata } = req.body;

    if (!event_type || !source) {
      return res.status(400).json({ error: 'Event type and source are required' });
    }

    const userId = req.user.id;

    switch (event_type) {
      case 'click':
        await analyticsService.trackClick(userId, product_id, content_id, source, metadata);
        break;
      
      case 'view':
        const viewDuration = metadata?.duration || null;
        await analyticsService.trackView(userId, product_id, content_id, source, viewDuration);
        break;
      
      case 'conversion':
        if (!conversion_value) {
          return res.status(400).json({ error: 'Conversion value is required for conversion events' });
        }
        await analyticsService.trackConversion(userId, product_id, content_id, conversion_value, source);
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid event type' });
    }

    res.json({ message: 'Event tracked successfully' });
  } catch (error) {
    logger.error('Track event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const { date_range = '30d' } = req.query;
    const userId = req.user.id;

    const stats = await analyticsService.getDashboardStats(userId, date_range);

    res.json({
      date_range,
      stats
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { limit = 10, date_range = '30d' } = req.query;
    const userId = req.user.id;

    const topProducts = await analyticsService.getTopPerformingProducts(
      userId, 
      parseInt(limit), 
      date_range
    );

    res.json({
      date_range,
      limit: parseInt(limit),
      products: topProducts
    });
  } catch (error) {
    logger.error('Top products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlatformPerformance = async (req, res) => {
  try {
    const { date_range = '30d' } = req.query;
    const userId = req.user.id;

    const platformData = await analyticsService.getPerformanceByPlatform(userId, date_range);

    res.json({
      date_range,
      platforms: platformData
    });
  } catch (error) {
    logger.error('Platform performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTimeSeriesData = async (req, res) => {
  try {
    const { metric = 'clicks', date_range = '30d', interval = 'day' } = req.query;
    const userId = req.user.id;

    const validMetrics = ['clicks', 'views', 'conversions', 'revenue'];
    const validIntervals = ['hour', 'day', 'week', 'month'];

    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ error: 'Invalid metric. Valid options: clicks, views, conversions, revenue' });
    }

    if (!validIntervals.includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Valid options: hour, day, week, month' });
    }

    const timeSeriesData = await analyticsService.getTimeSeriesData(userId, metric, date_range, interval);

    res.json({
      metric,
      date_range,
      interval,
      data: timeSeriesData
    });
  } catch (error) {
    logger.error('Time series data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getContentPerformance = async (req, res) => {
  try {
    const { content_id } = req.params;
    const { date_range = '30d' } = req.query;
    const userId = req.user.id;

    const contentPerformance = await analyticsService.getContentPerformance(
      userId, 
      content_id || null, 
      date_range
    );

    res.json({
      date_range,
      content_id: content_id || 'all',
      performance: contentPerformance
    });
  } catch (error) {
    logger.error('Content performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateReport = async (req, res) => {
  try {
    const { date_range = '30d', format = 'json' } = req.query;
    const userId = req.user.id;

    // Get comprehensive analytics data
    const [
      dashboardStats,
      topProducts,
      platformPerformance,
      contentPerformance,
      clicksTimeSeries,
      revenueTimeSeries
    ] = await Promise.all([
      analyticsService.getDashboardStats(userId, date_range),
      analyticsService.getTopPerformingProducts(userId, 20, date_range),
      analyticsService.getPerformanceByPlatform(userId, date_range),
      analyticsService.getContentPerformance(userId, null, date_range),
      analyticsService.getTimeSeriesData(userId, 'clicks', date_range, 'day'),
      analyticsService.getTimeSeriesData(userId, 'revenue', date_range, 'day')
    ]);

    const report = {
      generated_at: new Date().toISOString(),
      date_range,
      user_id: userId,
      summary: dashboardStats,
      top_products: topProducts,
      platform_performance: platformPerformance,
      content_performance: contentPerformance,
      trends: {
        clicks: clicksTimeSeries,
        revenue: revenueTimeSeries
      }
    };

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = this.generateCSVReport(report);
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-report-${date_range}-${Date.now()}.csv"`
      });
      res.send(csvData);
    } else {
      res.json(report);
    }
  } catch (error) {
    logger.error('Generate report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateCSVReport = (report) => {
  // Simple CSV generation for top products
  const csvLines = [
    'Product Title,Source,Clicks,Views,Conversions,Revenue,CTR,Conversion Rate'
  ];

  report.top_products.forEach(product => {
    csvLines.push([
      product.title.replace(/,/g, ' '),
      product.source,
      product.clicks,
      product.views,
      product.conversions,
      product.revenue,
      product.ctr,
      product.conversion_rate
    ].join(','));
  });

  return csvLines.join('\n');
};

const getRealTimeStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get stats for the last 24 hours with hourly breakdown
    const [
      last24hStats,
      hourlyData,
      recentEvents
    ] = await Promise.all([
      analyticsService.getDashboardStats(userId, '24h'),
      analyticsService.getTimeSeriesData(userId, 'clicks', '24h', 'hour'),
      // Get recent events (this would need to be implemented in analytics service)
      Promise.resolve([]) // Placeholder
    ]);

    res.json({
      last_24h: last24hStats,
      hourly_trends: hourlyData,
      recent_activity: recentEvents,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Real-time stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  trackEvent,
  getDashboardStats,
  getTopProducts,
  getPlatformPerformance,
  getTimeSeriesData,
  getContentPerformance,
  generateReport,
  getRealTimeStats
};