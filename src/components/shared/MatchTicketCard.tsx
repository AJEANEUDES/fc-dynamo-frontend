import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FootballMatch } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

type Availability = 'available' | 'limited' | 'soldOut';

interface Props {
  match: FootballMatch;
  availability?: Availability;
}

const BADGE_STYLES: Record<Availability, string> = {
  available: 'bg-green-100 text-green-700',
  limited:   'bg-orange-100 text-orange-700',
  soldOut:   'bg-red-100 text-red-600',
};

export default function MatchTicketCard({ match, availability = 'available' }: Props) {
  const { t } = useTranslation('tickets');
  const { formatDate } = useLocalized();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Match info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              match.home_away === 'home'
                ? 'bg-[#0A2342] text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {match.home_away === 'home' ? t('home') : t('away')}
          </span>
          {match.competition && (
            <span className="text-xs text-gray-400 truncate">{match.competition.name_ru}</span>
          )}
        </div>

        <h3 className="font-extrabold text-[#0A2342] text-base leading-tight">
          FC Dynamo City — {match.opponent}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {formatDate(match.match_date, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          · {match.stadium}
        </p>

        <p className="text-sm font-semibold text-[#0A2342] mt-1">{t('pricePerTicket')}</p>
      </div>

      {/* Badge + CTA */}
      <div className="flex sm:flex-col items-center gap-3 flex-shrink-0">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${BADGE_STYLES[availability]}`}>
          {t(`availability.${availability}`)}
        </span>

        {availability !== 'soldOut' ? (
          <Link
            to={`/billetterie/${match.id}`}
            className="bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            {t('buyTicket')}
          </Link>
        ) : (
          <span className="text-gray-300 text-sm font-bold px-5 py-2">
            {t('availability.soldOut')}
          </span>
        )}
      </div>
    </div>
  );
}
