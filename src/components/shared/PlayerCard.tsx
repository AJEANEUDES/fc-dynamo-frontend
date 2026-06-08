import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Player } from '../../types';

interface Props {
  player: Player;
}

const positionColors: Record<string, string> = {
  'gardien': 'bg-[#C8A951] text-[#0A2342]',
  'défenseur': 'bg-blue-600 text-white',
  'milieu': 'bg-[#0D6B4A] text-white',
  'attaquant': 'bg-[#C0392B] text-white',
};

export default function PlayerCard({ player }: Props) {
  const { t } = useTranslation('team');
  const posBg = positionColors[player.position_group] ?? 'bg-gray-500 text-white';

  return (
    <Link
      to={`/equipe/${player.id}`}
      className="group relative block bg-[#0A2342] rounded-2xl overflow-hidden
                 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-2xl"
    >
      <div className="relative h-48 bg-[#1E3A5F]">
        <img
          src={player.photo ?? '/assets/default-player.svg'}
          alt={`${player.first_name} ${player.last_name}`}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = '/assets/default-player.svg'; }
          }}
        />
        <span className="absolute top-3 left-3 bg-[#C8A951] text-[#0A2342] text-lg font-black px-3 py-1 rounded-lg shadow">
          #{player.jersey_number}
        </span>
        <span className={`absolute top-3 right-3 ${posBg} text-xs font-bold px-2 py-1 rounded-full`}>
          {t(`player.positionLabels.${player.position_group}`)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold leading-tight">
          {player.first_name} {player.last_name}
        </h3>
        <p className="text-[#C8A951] text-sm mt-1">{player.nationality}</p>
      </div>

      <div className="absolute inset-0 bg-[#C0392B]/80 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{t('viewProfile')}</span>
      </div>
    </Link>
  );
}
