import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FootballMatch } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

interface Props {
  match: FootballMatch;
}

const statusColor: Record<FootballMatch['status'], string> = {
  upcoming: 'bg-[#C8A951]/20 text-[#0A2342]',
  live: 'bg-[#C0392B]/15 text-[#C0392B] animate-pulse',
  finished: 'bg-gray-100 text-gray-600',
};

export default function MatchCard({ match }: Props) {
  const { t } = useTranslation('matches');
  const { formatDate } = useLocalized();
  const date = formatDate(match.match_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Link
      to={`/matchs/${match.id}`}
      className="block bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-2xl transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[match.status]}`}>
          {t(`status.${match.status}`)}
        </span>
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      <div className="flex items-center justify-center gap-6 my-4">
        <span className="font-bold text-[#0A2342]">FC Dynamo City</span>
        {match.status === 'finished' || match.status === 'live' ? (
          <span className="text-2xl font-extrabold text-[#0A2342]">
            {match.score_home} — {match.score_away}
          </span>
        ) : (
          <span className="text-lg font-bold text-[#C8A951]">{t('vs')}</span>
        )}
        <span className="font-bold text-gray-700">{match.opponent}</span>
      </div>

      <p className="text-center text-xs text-gray-400">{match.stadium}</p>
    </Link>
  );
}
