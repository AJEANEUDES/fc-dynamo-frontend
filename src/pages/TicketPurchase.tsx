import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useLocalized } from '../hooks/useLocale';
import type { FootballMatch, Ticket } from '../types';
import api from '../api/axios';

const PRICE_PER_TICKET = 25.00;

export default function TicketPurchase() {
  const { t } = useTranslation('tickets');
  const { matchId } = useParams<{ matchId: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { formatDate } = useLocalized();
  const navigate = useNavigate();

  const { data: match, isLoading: matchLoading } = useGet<FootballMatch>(
    ['match-ticket', matchId ?? ''],
    `/matches/${matchId}`
  );

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/connexion', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  async function handlePay() {
    if (!match || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post<Ticket>('/tickets', { match_id: match.id, quantity });
      navigate('/billetterie/confirmation', { state: { ticket: res.data, match } });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? t('common:errors.serverError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || matchLoading) {
    return <div className="text-center py-20 text-gray-400 text-lg">{t('common:loading')}</div>;
  }
  if (!match) return null;

  const total = (PRICE_PER_TICKET * quantity).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        to="/billetterie"
        className="inline-flex items-center gap-2 text-[#0A2342] hover:text-[#C0392B] mb-8 text-sm font-semibold transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('backToTickets')}
      </Link>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Match header */}
        <div className="bg-[#0A2342] px-6 py-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                match.home_away === 'home'
                  ? 'bg-[#C8A951] text-[#0A2342]'
                  : 'bg-white/20 text-white'
              }`}
            >
              {match.home_away === 'home' ? t('home') : t('away')}
            </span>
            {match.competition && (
              <span className="text-white/60 text-xs">{match.competition.name_ru}</span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-white leading-tight">
            FC Dynamo City — {match.opponent}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {formatDate(match.match_date, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-[#C8A951] text-sm mt-0.5">{match.stadium}</p>
        </div>

        {/* Purchase form */}
        <div className="p-6 flex flex-col gap-6">
          {/* Quantity — RM-02 max 4 */}
          <div>
            <p className="text-sm font-bold text-[#0A2342] mb-3">{t('quantity')}</p>
            <div className="flex gap-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setQuantity(n)}
                  className={`w-12 h-12 rounded-xl font-extrabold text-base border-2 transition-colors ${
                    quantity === n
                      ? 'bg-[#0A2342] text-white border-[#0A2342]'
                      : 'bg-white text-[#0A2342] border-gray-200 hover:border-[#0A2342]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{t('maxTickets')}</p>
          </div>

          {/* Price summary */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{t('pricePerTicket')} × {quantity}</span>
              <span>{total} €</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#0A2342] text-lg border-t border-gray-200 pt-2">
              <span>{t('total')}</span>
              <span>{total} €</span>
            </div>
          </div>

          {/* Error (RM-01 / RM-02 messages from backend in Russian) */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Pay */}
          <button
            onClick={handlePay}
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all ${
              submitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#C0392B] text-white hover:bg-[#a93226] active:scale-95 shadow-lg'
            }`}
          >
            {submitting ? t('paying') : `${t('pay')} — ${total} €`}
          </button>
        </div>
      </div>
    </div>
  );
}
