import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { FootballMatch } from '../types';
import MatchTicketCard from '../components/shared/MatchTicketCard';

const OPTION_KEYS = ['ticketplace', 'standard', 'vip', 'gift'] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

const OPTION_ICONS: Record<OptionKey, string> = {
  ticketplace: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  standard:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  vip:         'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  gift:        'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
};

export default function Ticketing() {
  const { t } = useTranslation('tickets');
  const { data: matches, isLoading } = useGet<FootballMatch[]>(
    'matches-upcoming',
    '/matches?status=upcoming'
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0A2342] py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{t('title')}</h1>
        <p className="text-[#C8A951] mt-2 text-lg font-medium">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 4 option cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {OPTION_KEYS.map((key) => (
            <div
              key={key}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-default"
            >
              <div className="w-12 h-12 bg-[#0A2342]/10 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#0A2342]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={OPTION_ICONS[key]} />
                </svg>
              </div>
              <h3 className="font-bold text-[#0A2342] text-sm">{t(`options.${key}.title`)}</h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{t(`options.${key}.desc`)}</p>
            </div>
          ))}
        </div>

        {/* Upcoming matches */}
        <h2 className="text-2xl font-extrabold text-[#0A2342] mb-6">{t('upcoming')}</h2>

        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-lg">{t('common:loading')}</div>
        ) : !matches?.length ? (
          <div className="text-center py-16 text-gray-400 text-lg">{t('noMatches')}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {matches.map((m) => (
              <MatchTicketCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
