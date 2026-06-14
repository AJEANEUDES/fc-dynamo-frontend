import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { t } = useTranslation('shop');
  const { pick } = useLocalized();
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/boutique/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden">
        <div className="relative h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={pick(product.name_ru, product.name_en)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}

          {product.is_customizable && (
            <span className="absolute top-2 right-2 bg-[#C8A951] text-[#0A2342] text-xs font-bold px-2 py-1 rounded-full">
              {t('customizable')}
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{t('outOfStock')}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-[#0A2342] text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {pick(product.name_ru, product.name_en)}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[#C0392B] font-extrabold text-lg">
              {Number(product.price).toFixed(2)} €
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-orange-500 font-semibold">
                {t('stockLabel')}: {product.stock}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
