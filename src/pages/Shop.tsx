import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Product } from '../types';
import ProductCard from '../components/shared/ProductCard';

const CATEGORY_KEYS = ['all', 'maillots', 'shorts', 'vestes', 'accessoires', 'entrainement', 'lifestyle'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

export default function Shop() {
  const { t } = useTranslation('shop');
  const { data: products, isLoading } = useGet<Product[]>('products', '/products');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const filtered = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category_store === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0A2342] py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{t('title')}</h1>
        <p className="text-[#C8A951] mt-2 text-lg font-medium">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === key
                  ? 'bg-[#0A2342] text-white shadow-md'
                  : 'bg-white text-[#0A2342] border border-[#0A2342]/30 hover:bg-[#0A2342]/10'
              }`}
            >
              {t(`categories.${key}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 text-lg">{t('common:loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">{t('noProducts')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
