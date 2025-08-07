import React, { useState, useEffect } from 'react';
import {
  TrendingUpIcon,
  EyeIcon,
  CursorClickIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/outline';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  total_clicks: number;
  total_views: number;
  total_conversions: number;
  total_revenue: number;
  ctr: number;
  conversion_rate: number;
}

interface TopProduct {
  id: number;
  title: string;
  source: string;
  clicks: number;
  views: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversion_rate: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - in real app this would come from API
      const mockStats: DashboardStats = {
        total_clicks: 1247,
        total_views: 8932,
        total_conversions: 89,
        total_revenue: 4567.89,
        ctr: 13.96,
        conversion_rate: 7.14
      };

      const mockTopProducts: TopProduct[] = [
        {
          id: 1,
          title: 'Smartphone Android Premium',
          source: 'shopee',
          clicks: 342,
          views: 1250,
          conversions: 23,
          revenue: 1890.50,
          ctr: 27.36,
          conversion_rate: 6.73
        },
        {
          id: 2,
          title: 'Fones Bluetooth Wireless',
          source: 'amazon',
          clicks: 187,
          views: 890,
          conversions: 15,
          revenue: 789.25,
          ctr: 21.01,
          conversion_rate: 8.02
        }
      ];

      setStats(mockStats);
      setTopProducts(mockTopProducts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Visualizações',
      value: stats?.total_views?.toLocaleString() || '0',
      icon: EyeIcon,
      color: 'blue',
      change: '+12.5%'
    },
    {
      title: 'Total de Cliques',
      value: stats?.total_clicks?.toLocaleString() || '0',
      icon: CursorClickIcon,
      color: 'green',
      change: '+8.3%'
    },
    {
      title: 'Conversões',
      value: stats?.total_conversions?.toLocaleString() || '0',
      icon: TrendingUpIcon,
      color: 'purple',
      change: '+15.2%'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats?.total_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
      icon: CurrencyDollarIcon,
      color: 'yellow',
      change: '+23.1%'
    }
  ];

  const quickActions = [
    {
      title: 'Buscar Produtos',
      description: 'Encontre produtos virais para promover',
      icon: ShoppingBagIcon,
      href: '/products',
      color: 'blue'
    },
    {
      title: 'Gerar Conteúdo',
      description: 'Crie conteúdo com IA automaticamente',
      icon: DocumentTextIcon,
      href: '/content',
      color: 'purple'
    },
    {
      title: 'Ver Analytics',
      description: 'Analise a performance das campanhas',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'green'
    },
    {
      title: 'Configurações',
      description: 'Configure suas preferências',
      icon: UserGroupIcon,
      href: '/settings',
      color: 'gray'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Bem-vindo de volta, {user?.name}! 👋
            </h1>
            <p className="mt-1 text-blue-100">
              Vamos continuar impulsionando suas vendas com IA
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-100">CTR Médio</p>
              <p className="text-2xl font-bold">{stats?.ctr.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 text-green-600`}>
                    {stat.change} vs mês anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Produtos com Melhor Performance
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className={`badge badge-${product.source === 'amazon' ? 'warning' : 'primary'}`}>
                        {product.source.toUpperCase()}
                      </span>
                      <span>{product.clicks} cliques</span>
                      <span>{product.ctr.toFixed(1)}% CTR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.conversions} conversões
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Ações Rápidas
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Atividade Recente
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {[
              { action: 'Conteúdo gerado', item: 'Post para Smartphone Android', time: '2 horas atrás', status: 'success' },
              { action: 'Produto sincronizado', item: 'Fones Bluetooth da Amazon', time: '5 horas atrás', status: 'info' },
              { action: 'Campanha publicada', item: 'Instagram - Produtos Tech', time: '1 dia atrás', status: 'success' },
              { action: 'Conversão registrada', item: 'R$ 89,90 - Shopee', time: '2 dias atrás', status: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' : 
                    activity.status === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;