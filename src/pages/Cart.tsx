import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useLocalized } from '../hooks/useLocale';

export default function Cart() {
  const { t } = useTranslation('shop');
  const { items, total, removeItem, updateQuantity } = useCart();
  const { pick } = useLocalized();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-extrabold text-[#0A2342]">{t('cart.empty')}</h2>
        <Link to="/boutique" className="text-[#C0392B] font-semibold hover:underline transition-colors">
          {t('cart.emptyHint')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#0A2342] mb-8">{t('cart.title')}</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const name = pick(item.product.name_ru, item.product.name_en);
          return (
            <div
              key={`${item.product.id}-${item.size ?? ''}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {item.product.image ? (
                  <img src={item.product.image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0A2342] text-sm truncate">{name}</h3>
                <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-gray-400">
                  {item.size && <span>{t('cart.size')}: {item.size}</span>}
                  {item.flocage_name_ru && <span>{t('cart.flocageName')}: {item.flocage_name_ru}</span>}
                  {item.flocage_number !== undefined && (
                    <span>{t('cart.flocageNumber')}: {item.flocage_number}</span>
                  )}
                </div>
                <p className="text-[#C0392B] font-bold mt-2 text-sm">
                  {(Number(item.product.price) * item.quantity).toFixed(2)} €
                </p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors leading-none"
                  aria-label="-"
                >
                  −
                </button>
                <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors leading-none"
                  aria-label="+"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.product.id, item.size)}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                aria-label={t('cart.remove')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Total + CTA */}
      <div className="mt-8 bg-[#0A2342] rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[#C8A951] font-semibold text-lg">{t('cart.total')}</span>
          <span className="text-2xl font-extrabold">{total.toFixed(2)} €</span>
        </div>
        <Link
          to="/commande"
          className="block w-full text-center bg-[#C0392B] hover:bg-[#a93226] text-white font-extrabold py-4 rounded-xl transition-colors shadow-lg"
        >
          {t('cart.checkout')}
        </Link>
      </div>
    </div>
  );
}
