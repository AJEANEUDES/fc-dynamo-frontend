import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Product } from '../types';
import { useLocalized } from '../hooks/useLocale';
import { useCart } from '../context/CartContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
type Size = (typeof SIZES)[number];

const CYRILLIC_RE = /^[Ѐ-ӿ\s]*$/;

export default function ProductDetail() {
  const { t } = useTranslation('shop');
  const { id } = useParams<{ id: string }>();
  const { pick } = useLocalized();
  const { data: product, isLoading } = useGet<Product>(['product', id ?? ''], `/products/${id}`);

  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [flocageName, setFlocageName] = useState('');
  const [flocageNumber, setFlocageNumber] = useState('');
  const [flocageNameError, setFlocageNameError] = useState(false);
  const [added, setAdded] = useState(false);

  function handleFlocageName(value: string) {
    setFlocageName(value);
    setFlocageNameError(value.length > 0 && !CYRILLIC_RE.test(value));
  }

  function handleAddToCart() {
    if (flocageNameError || !product || product.stock === 0) return;
    addItem({
      product,
      quantity: 1,
      size: selectedSize ?? undefined,
      flocage_name_ru: flocageName.trim() || undefined,
      flocage_number: flocageNumber ? parseInt(flocageNumber, 10) : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400 text-lg">{t('common:loading')}</div>;
  }
  if (!product) return null;

  const name = pick(product.name_ru, product.name_en);
  const description = product.description_ru ? pick(product.description_ru, product.description_en) : null;
  const hasFlocagePreview = product.is_customizable && (flocageName.trim() || flocageNumber);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        to="/boutique"
        className="inline-flex items-center gap-2 text-[#0A2342] hover:text-[#C0392B] mb-8 text-sm font-semibold transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('back')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A2342] leading-tight">{name}</h1>
            {description && (
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-3xl font-extrabold text-[#C0392B]">
              {Number(product.price).toFixed(2)} €
            </span>
            {product.is_customizable && (
              <span className="bg-[#C8A951] text-[#0A2342] text-xs font-bold px-3 py-1 rounded-full">
                {t('customizable')}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0
              ? `${t('inStock')} (${product.stock})`
              : t('outOfStock')}
          </p>

          {/* Size selector */}
          <div>
            <p className="text-sm font-bold text-[#0A2342] mb-2">{t('sizeLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={`w-12 h-12 rounded-lg text-sm font-bold border-2 transition-colors ${
                    selectedSize === size
                      ? 'bg-[#0A2342] text-white border-[#0A2342]'
                      : 'bg-white text-[#0A2342] border-gray-300 hover:border-[#0A2342]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Flocage — only for customizable products */}
          {product.is_customizable && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h3 className="font-bold text-[#0A2342] mb-3">{t('flocage.title')}</h3>

              <div className="flex flex-col gap-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {t('flocage.nameLabel')}
                  </label>
                  <input
                    type="text"
                    value={flocageName}
                    onChange={(e) => handleFlocageName(e.target.value)}
                    placeholder={t('flocage.namePlaceholder')}
                    maxLength={50}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
                      flocageNameError
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-[#0A2342]'
                    }`}
                  />
                  {flocageNameError && (
                    <p className="text-red-500 text-xs mt-1">{t('flocage.invalidName')}</p>
                  )}
                </div>

                {/* Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {t('flocage.numberLabel')}
                  </label>
                  <input
                    type="number"
                    value={flocageNumber}
                    onChange={(e) => setFlocageNumber(e.target.value)}
                    min={0}
                    max={99}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A2342] transition-colors"
                  />
                </div>
              </div>

              {/* Preview */}
              {hasFlocagePreview && (
                <div className="mt-4 bg-[#0A2342] rounded-xl p-5 text-center">
                  <p className="text-[#C8A951] text-xs font-bold uppercase tracking-widest mb-2">
                    {t('flocage.preview')}
                  </p>
                  {flocageName.trim() && (
                    <p className="text-white font-extrabold text-xl tracking-widest uppercase leading-tight">
                      {flocageName}
                    </p>
                  )}
                  {flocageNumber && (
                    <p className="text-[#C8A951] font-extrabold text-5xl leading-none mt-1">
                      {flocageNumber}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || flocageNameError}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all ${
              added
                ? 'bg-green-600 text-white'
                : product.stock === 0 || flocageNameError
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#C0392B] text-white hover:bg-[#a93226] active:scale-95 shadow-lg'
            }`}
          >
            {added ? t('added') : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
