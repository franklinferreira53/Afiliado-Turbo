import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  ImageIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ShareIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  RefreshIcon,
} from '@heroicons/react/outline';

interface Content {
  id: number;
  title: string;
  type: 'social_post' | 'image' | 'video_script' | 'description';
  status: 'draft' | 'approved' | 'published' | 'rejected';
  product_title: string;
  content_url?: string;
  thumbnail_url?: string;
  created_at: string;
  hashtags?: string[];
  cta_text?: string;
}

const ContentPage: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | Content['type']>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Content['status']>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const contentTypes = [
    { value: 'all', label: 'Todos', icon: DocumentTextIcon },
    { value: 'social_post', label: 'Post Social', icon: ShareIcon },
    { value: 'image', label: 'Imagem', icon: ImageIcon },
    { value: 'video_script', label: 'Script de Vídeo', icon: VideoCameraIcon },
    { value: 'description', label: 'Descrição', icon: DocumentTextIcon },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos', color: 'gray' },
    { value: 'draft', label: 'Rascunho', color: 'yellow' },
    { value: 'approved', label: 'Aprovado', color: 'green' },
    { value: 'published', label: 'Publicado', color: 'blue' },
    { value: 'rejected', label: 'Rejeitado', color: 'red' },
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Mock content data
      const mockContent: Content[] = [
        {
          id: 1,
          title: 'Post para Smartphone Samsung Galaxy A54',
          type: 'social_post',
          status: 'published',
          product_title: 'Smartphone Samsung Galaxy A54 128GB',
          content_url: 'https://via.placeholder.com/400x400/1f2937/ffffff?text=Post+Galaxy',
          created_at: '2024-01-15T10:30:00Z',
          hashtags: ['#smartphone', '#samsung', '#galaxy', '#tecnologia', '#oferta'],
          cta_text: '🔥 Garante o seu agora! Link na bio'
        },
        {
          id: 2,
          title: 'Imagem futurista para Fones JBL',
          type: 'image',
          status: 'approved',
          product_title: 'Fones de Ouvido Bluetooth JBL Tune 510BT',
          content_url: 'https://via.placeholder.com/400x400/374151/ffffff?text=JBL+Image',
          created_at: '2024-01-14T15:20:00Z'
        },
        {
          id: 3,
          title: 'Script de vídeo para Smartwatch',
          type: 'video_script',
          status: 'draft',
          product_title: 'Smartwatch Amazfit GTR 4',
          created_at: '2024-01-14T09:15:00Z'
        },
        {
          id: 4,
          title: 'Descrição otimizada para produto tech',
          type: 'description',
          status: 'approved',
          product_title: 'Carregador Wireless Premium',
          created_at: '2024-01-13T16:45:00Z'
        }
      ];
      
      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: Content['status']) => {
    const statusColor = statusOptions.find(s => s.value === status)?.color || 'gray';
    return `badge-${statusColor}`;
  };

  const getTypeIcon = (type: Content['type']) => {
    const typeConfig = contentTypes.find(t => t.value === type);
    return typeConfig?.icon || DocumentTextIcon;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateNewContent = () => {
    setShowGenerateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conteúdo Gerado</h1>
          <p className="mt-1 text-gray-600">
            Gerencie todo o conteúdo criado com IA
          </p>
        </div>
        <button
          onClick={generateNewContent}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Gerar Conteúdo</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conteúdo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="input-field"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="input-field"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button
                onClick={fetchContent}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshIcon className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            
            return (
              <div key={item.id} className="card hover-scale">
                <div className="relative">
                  {item.content_url ? (
                    <img
                      src={item.content_url}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <TypeIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${getStatusColor(item.status)}`}>
                      {statusOptions.find(s => s.value === item.status)?.label}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md">
                    <TypeIcon className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Para: {item.product_title}
                  </p>

                  {item.hashtags && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.hashtags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {item.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{item.hashtags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {item.cta_text && (
                    <p className="text-sm italic text-gray-700 mb-3 line-clamp-2">
                      "{item.cta_text}"
                    </p>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    {formatDate(item.created_at)}
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                    <button className="btn-secondary p-2" title="Editar">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn-secondary p-2 text-red-600 hover:bg-red-50" title="Excluir">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredContent.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DocumentTextIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum conteúdo encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedType === 'all' && selectedStatus === 'all' 
              ? 'Comece gerando seu primeiro conteúdo com IA.'
              : 'Tente ajustar os filtros para ver mais conteúdo.'
            }
          </p>
          <button
            onClick={generateNewContent}
            className="btn-primary"
          >
            Gerar Primeiro Conteúdo
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total de Conteúdo', value: content.length, color: 'blue' },
          { label: 'Publicados', value: content.filter(c => c.status === 'published').length, color: 'green' },
          { label: 'Em Rascunho', value: content.filter(c => c.status === 'draft').length, color: 'yellow' },
          { label: 'Aprovados', value: content.filter(c => c.status === 'approved').length, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;