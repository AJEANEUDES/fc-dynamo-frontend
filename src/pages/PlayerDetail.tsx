import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Player } from '../types';
import { useLocalized } from '../hooks/useLocale';

export default function PlayerDetail() {
  const { t } = useTranslation('team');
  const { id } = useParams<{ id: string }>();
  const { pick, formatDate } = useLocalized();
  const { data: player, isLoading } = useGet<Player>(['player', id ?? ''], `/players/${id}`);

  if (isLoading) return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;
  if (!player) return <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>;

  const bio = pick(player.bio_ru ?? '', player.bio_en);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/equipe" className="text-[#C0392B] hover:underline text-sm font-medium">{t('player.back')}</Link>

      <div className="mt-4 bg-[#0A2342] rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
        <div className="md:w-1/3 h-72 md:h-auto bg-[#1E3A5F]">
          <img
            src={player.photo ?? '/assets/default-player.svg'}
            alt={`${player.first_name} ${player.last_name}`}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = '/assets/default-player.svg'; }
            }}
          />
        </div>
        <div className="p-6 md:p-8 flex-1 text-white">
          <div className="flex items-center gap-3">
            <span className="bg-[#C8A951] text-[#0A2342] text-xl font-black px-3 py-1 rounded-lg">
              #{player.jersey_number}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold">{player.first_name} {player.last_name}</h1>
            {player.is_on_loan && (
              <span className="bg-[#C0392B] text-white text-xs font-bold px-2 py-1 rounded-full">{t('player.onLoan')}</span>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <dt className="text-[#C8A951] uppercase text-xs tracking-wide">{t('player.position')}</dt>
              <dd className="mt-1">{t(`player.positionLabels.${player.position_group}`)}</dd>
            </div>
            <div>
              <dt className="text-[#C8A951] uppercase text-xs tracking-wide">{t('player.nationality')}</dt>
              <dd className="mt-1">{player.nationality}</dd>
            </div>
            <div>
              <dt className="text-[#C8A951] uppercase text-xs tracking-wide">{t('player.birthDate')}</dt>
              <dd className="mt-1">{formatDate(player.birth_date)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {bio && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#0A2342] mb-2 pb-2 border-b-4 border-[#C0392B]">{t('player.biography')}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
        </section>
      )}

      {player.stats && Object.keys(player.stats).length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#0A2342] mb-4 pb-2 border-b-4 border-[#C0392B]">{t('player.stats')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(player.stats).map(([key, value]) => (
              <div key={key} className="bg-white rounded-2xl shadow p-4 text-center">
                <p className="text-2xl font-bold text-[#0A2342]">{value}</p>
                <p className="text-xs text-gray-400 uppercase mt-1">{key}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
