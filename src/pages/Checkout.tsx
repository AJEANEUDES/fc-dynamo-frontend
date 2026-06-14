import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useLocalized } from '../hooks/useLocale';
import api from '../api/axios';
import type { Order } from '../types';

const ADDRESS_FIELDS = ['name', 'street', 'city', 'zip', 'country'] as const;
type AddressField = (typeof ADDRESS_FIELDS)[number];

export default function Checkout() {
  const { t } = useTranslation('shop');
  const { items, total, clearCart } = useCart();
  const { pick } = useLocalized();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          ...(i.size ? { size: i.size } : {}),
          ...(i.flocage_name_ru ? { flocage_name_ru: i.flocage_name_ru } : {}),
          ...(i.flocage_number !== undefined ? { flocage_number: i.flocage_number } : {}),
        })),
      };

      const res = await api.post<{ message: string; order: Order }>('/orders', payload);
      clearCart();
      navigate('/commande-confirmee', { state: { order: res.data.order } });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? t('checkout.serverError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">{t('cart.empty')}</p>
        <Link to="/boutique" className="text-[#C0392B] font-semibold hover:underline">
          {t('cart.emptyHint')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#0A2342] mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order summary */}
        <div>
          <h2 className="font-bold text-[#0A2342] mb-4 text-lg">{t('checkout.summary')}</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size ?? ''}`}
                className="flex justify-between items-start bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-sm"
              >
                <div className="min-w-0 pr-3">
                  <p className="font-semibold text-[#0A2342] truncate">
                    {pick(item.product.name_ru, item.product.name_en)}
                  </p>
                  {item.size && (
                    <p className="text-xs text-gray-400">{t('cart.size')}: {item.size}</p>
                  )}
                  <p className="text-xs text-gray-400">{t('cart.quantity')}: {item.quantity}</p>
                </div>
                <span className="font-bold text-[#C0392B] flex-shrink-0">
                  {(Number(item.product.price) * item.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-extrabold text-[#0A2342] text-lg border-t border-gray-200 pt-3">
            <span>{t('cart.total')}</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Address + submit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-bold text-[#0A2342] text-lg">{t('checkout.address.title')}</h2>

          {ADDRESS_FIELDS.map((field: AddressField) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                {t(`checkout.address.${field}`)}
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A2342] transition-colors"
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all mt-2 ${
              submitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#C0392B] text-white hover:bg-[#a93226] active:scale-95 shadow-lg'
            }`}
          >
            {submitting ? t('checkout.submitting') : t('checkout.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
