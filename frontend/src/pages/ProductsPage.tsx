import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  FilterIcon,
  StarIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/solid';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  product_url: string;
  affiliate_link: string;
  source: 'amazon' | 'shopee';
  category: string;
  rating: number;
  reviews_count: number;
  popularity_score: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'amazon' | 'shopee'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
  const [showTrending, setShowTrending] = useState(true);

  const categories = [
    'all',
    'electronics',
    'home',
    'beauty',
    'sports',
    'toys',
    'books',
    'clothing'
  ];

  useEffect(() => {
    if (showTrending) {
      fetchTrendingProducts();
    }
  }, []);

  const fetchTrendingProducts = async () => {
    setIsLoading(true);
    try {
      // Mock trending products data
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Smartphone Samsung Galaxy A54 128GB',
          description: 'Smartphone com excelente custo-benefício, câmera tripla e bateria de longa duração',
          price: 1299.99,
          original_price: 1599.99,
          image_url: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Galaxy+A54',
          product_url: 'https://shopee.com.br/product/1',
          affiliate_link: 'https://shopee.com.br/product/1?affiliate=demo',
          source: 'shopee',
          category: 'electronics',
          rating: 4.5,
          reviews_count: 2847,
          popularity_score: 95
        },
        {
          id: 2,
          title: 'Fones de Ouvido Bluetooth JBL Tune 510BT',
          description: 'Fones sem fio com qualidade de som JBL e 40 horas de bateria',
          price: 189.90,
          original_price: 299.99,
          image_url: 'https://via.placeholder.com/300x300/374151/ffffff?text=JBL+Tune',
          product_url: 'https://amazon.com.br/product/2',
          affiliate_link: 'https://amazon.com.br/product/2?tag=affiliate',
          source: 'amazon',
          category: 'electronics',
          rating: 4.3,
          reviews_count: 1256,
          popularity_score: 88
        },
        {
          id: 3,
          title: 'Smartwatch Amazfit GTR 4',
          description: 'Smartwatch com GPS, monitor cardíaco e 14 dias de bateria',
          price: 699.99,
          original_price: 899.99,
          image_url: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Amazfit',
          product_url: 'https://shopee.com.br/product/3',
          affiliate_link: 'https://shopee.com.br/product/3?affiliate=demo',
          source: 'shopee',
          category: 'electronics',
          rating: 4.7,
          reviews_count: 892,
          popularity_score: 92
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowTrending(false);
    
    try {
      // Mock search results
      const mockSearchResults: Product[] = [
        {
          id: 4,
          title: `Resultado para "${searchQuery}"`,
          description: 'Produto encontrado baseado na sua busca',
          price: 99.99,
          original_price: 149.99,
          image_url: 'https://via.placeholder.com/300x300/9ca3af/ffffff?text=Busca',
          product_url: 'https://example.com',
          affiliate_link: 'https://example.com?affiliate=demo',
          source: selectedSource === 'all' ? 'amazon' : selectedSource,
          category: selectedCategory === 'all' ? 'electronics' : selectedCategory,
          rating: 4.0,
          reviews_count: 100,
          popularity_score: 75
        }
      ];
      
      setProducts(mockSearchResults);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async (productId: number) => {
    try {
      const newSavedProducts = new Set(savedProducts);
      if (savedProducts.has(productId)) {
        newSavedProducts.delete(productId);
      } else {
        newSavedProducts.add(productId);
      }
      setSavedProducts(newSavedProducts);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const generateContent = async (productId: number) => {
    // This would navigate to content generation or trigger modal
    console.log('Generate content for product:', productId);
  };

  const filteredProducts = products.filter(product => {
    if (selectedSource !== 'all' && product.source !== selectedSource) return false;
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showTrending ? 'Produtos em Alta' : 'Busca de Produtos'}
          </h1>
          <p className="mt-1 text-gray-600">
            {showTrending 
              ? 'Produtos com maior potencial de conversão' 
              : `${filteredProducts.length} produtos encontrados`
            }
          </p>
        </div>
        <button
          onClick={fetchTrendingProducts}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as any)}
                className="input-field"
              >
                <option value="all">Todas as fontes</option>
                <option value="amazon">Amazon</option>
                <option value="shopee">Shopee</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas categorias' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={searchProducts}
              disabled={!searchQuery.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Buscar
            </button>
            <button
              onClick={() => {
                setShowTrending(true);
                setSearchQuery('');
                fetchTrendingProducts();
              }}
              className="btn-secondary"
            >
              Ver Produtos em Alta
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card hover-scale">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => saveProduct(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  {savedProducts.has(product.id) ? (
                    <BookmarkSolidIcon className="w-4 h-4 text-primary-600" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <div className={`absolute top-3 left-3 badge badge-${product.source === 'amazon' ? 'warning' : 'primary'}`}>
                  {product.source.toUpperCase()}
                </div>
              </div>

              <div className="card-body">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {product.original_price > product.price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  {product.original_price > product.price && (
                    <span className="badge badge-success">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews_count})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      product.popularity_score >= 90 ? 'bg-green-400' :
                      product.popularity_score >= 70 ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs text-gray-500">
                      {product.popularity_score}% popular
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => generateContent(product.id)}
                    className="btn-primary flex-1 text-sm py-2"
                  >
                    Gerar Conteúdo
                  </button>
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary p-2"
                    title="Ver produto"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar seus filtros ou fazer uma nova busca.
          </p>
          <button
            onClick={fetchTrendingProducts}
            className="btn-primary"
          >
            Ver Produtos em Alta
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;