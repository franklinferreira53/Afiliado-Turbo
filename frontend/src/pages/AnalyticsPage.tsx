import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  EyeIcon,
  CursorClickIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DownloadIcon,
} from '@heroicons/react/outline';

// We'll use Chart.js for the charts
// For now, we'll create placeholder components

interface AnalyticsData {
  overview: {
    total_views: number;
    total_clicks: number;
    total_conversions: number;
    total_revenue: number;
    ctr: number;
    conversion_rate: number;
  };
  timeSeriesData: Array<{
    date: string;
    clicks: number;
    views: number;
    conversions: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: number;
    title: string;
    clicks: number;
    revenue: number;
    conversion_rate: number;
  }>;
  platformPerformance: Array<{
    platform: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          total_views: 12847,
          total_clicks: 1792,
          total_conversions: 127,
          total_revenue: 8976.45,
          ctr: 13.94,
          conversion_rate: 7.09
        },
        timeSeriesData: [
          { date: '2024-01-08', clicks: 89, views: 567, conversions: 7, revenue: 456.78 },
          { date: '2024-01-09', clicks: 124, views: 789, conversions: 12, revenue: 789.45 },
          { date: '2024-01-10', clicks: 156, views: 934, conversions: 9, revenue: 567.23 },
          { date: '2024-01-11', clicks: 98, views: 645, conversions: 15, revenue: 923.67 },
          { date: '2024-01-12', clicks: 187, views: 1123, conversions: 18, revenue: 1245.89 },
          { date: '2024-01-13', clicks: 143, views: 876, conversions: 11, revenue: 678.90 },
          { date: '2024-01-14', clicks: 167, views: 998, conversions: 14, revenue: 854.32 },
        ],
        topProducts: [
          { id: 1, title: 'Smartphone Samsung Galaxy A54', clicks: 342, revenue: 2890.50, conversion_rate: 8.5 },
          { id: 2, title: 'Fones JBL Tune 510BT', clicks: 287, revenue: 1567.89, conversion_rate: 6.3 },
          { id: 3, title: 'Smartwatch Amazfit GTR 4', clicks: 198, revenue: 1234.67, conversion_rate: 7.8 },
        ],
        platformPerformance: [
          { platform: 'Instagram', clicks: 856, conversions: 67, revenue: 4567.89 },
          { platform: 'Facebook', clicks: 643, conversions: 43, revenue: 2876.54 },
          { platform: 'TikTok', clicks: 293, conversions: 17, revenue: 1532.02 },
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    // This would generate and download a CSV/PDF report
    console.log('Exporting report...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Erro ao carregar dados</div>;
  }

  const { overview, timeSeriesData, topProducts, platformPerformance } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">
            Acompanhe a performance das suas campanhas
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="input-field"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={exportReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Visualizações',
            value: overview.total_views.toLocaleString(),
            icon: EyeIcon,
            color: 'blue',
            change: '+12.5%'
          },
          {
            title: 'Cliques',
            value: overview.total_clicks.toLocaleString(),
            icon: CursorClickIcon,
            color: 'green',
            change: '+8.3%'
          },
          {
            title: 'Conversões',
            value: overview.total_conversions.toLocaleString(),
            icon: TrendingUpIcon,
            color: 'purple',
            change: '+15.2%'
          },
          {
            title: 'Receita',
            value: `R$ ${overview.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: CurrencyDollarIcon,
            color: 'yellow',
            change: '+23.1%'
          }
        ].map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm mt-1 text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Taxa de Cliques (CTR)</h3>
          </div>
          <div className="card-body text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {overview.ctr.toFixed(2)}%
            </div>
            <p className="text-gray-600">
              {overview.total_clicks} cliques de {overview.total_views} visualizações
            </p>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(overview.ctr, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Taxa de Conversão</h3>
          </div>
          <div className="card-body text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {overview.conversion_rate.toFixed(2)}%
            </div>
            <p className="text-gray-600">
              {overview.total_conversions} conversões de {overview.total_clicks} cliques
            </p>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(overview.conversion_rate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Performance ao Longo do Tempo</h3>
          </div>
          <div className="card-body">
            {/* Mock chart - in real app would use Chart.js */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de Performance</p>
                <div className="mt-4 space-y-2">
                  {timeSeriesData.slice(-3).map((data, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{new Date(data.date).toLocaleDateString('pt-BR')}</span>
                      <span>{data.clicks} cliques</span>
                      <span className="text-green-600">R$ {data.revenue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Performance por Plataforma</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {platformPerformance.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                    <p className="text-sm text-gray-600">
                      {platform.clicks} cliques • {platform.conversions} conversões
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      R$ {platform.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((platform.conversions / platform.clicks) * 100).toFixed(1)}% conv.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Produtos com Melhor Performance</h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliques</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Taxa de Conversão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Receita</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{product.title}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        product.conversion_rate >= 8 ? 'badge-success' :
                        product.conversion_rate >= 6 ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {product.conversion_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;