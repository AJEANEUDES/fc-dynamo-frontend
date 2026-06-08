import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { FootballMatch } from '../types';
import { useLocalized } from '../hooks/useLocale';

const statusColor: Record<FootballMatch['status'], string> = {
  upcoming: 'bg-[#C8A951]/20 text-[#0A2342]',
  live: 'bg-[#C0392B]/15 text-[#C0392B] animate-pulse',
  finished: 'bg-gray-100 text-gray-600',
};

export default function MatchDetail() {
  const { t } = useTranslation('matches');
  const { id } = useParams<{ id: string }>();
  const { pick, formatDate } = useLocalized();
  const { data: match, isLoading } = useGet<FootballMatch>(['match', id ?? ''], `/matches/${id}`);

  if (isLoading) return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;
  if (!match) return <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>;

  const date = formatDate(match.match_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/matchs" className="text-[#C0392B] hover:underline text-sm font-medium">{t('detail.back')}</Link>

      <div className="mt-4 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#0A2342] py-3 text-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[match.status]}`}>
            {t(`status.${match.status}`)}
          </span>
        </div>

        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-8">
            <span className="text-xl font-bold text-[#0A2342]">FC Dynamo City</span>
            {match.status === 'finished' || match.status === 'live' ? (
              <span className="text-4xl font-extrabold text-[#0A2342]">
                {match.score_home} — {match.score_away}
              </span>
            ) : (
              <span className="text-2xl font-bold text-[#C8A951]">{t('vs')}</span>
            )}
            <span className="text-xl font-bold text-gray-700">{match.opponent}</span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-sm">
            <div>
              <dt className="text-gray-400 uppercase text-xs tracking-wide">{t('detail.date')}</dt>
              <dd className="mt-1 font-medium text-[#0A2342]">{date}</dd>
            </div>
            <div>
              <dt className="text-gray-400 uppercase text-xs tracking-wide">{t('detail.stadium')}</dt>
              <dd className="mt-1 font-medium text-[#0A2342]">{match.stadium}</dd>
            </div>
            {match.competition && (
              <div>
                <dt className="text-gray-400 uppercase text-xs tracking-wide">{t('detail.competition')}</dt>
                <dd className="mt-1 font-medium text-[#0A2342]">{pick(match.competition.name_ru, match.competition.name_en)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
