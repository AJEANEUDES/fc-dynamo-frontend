import type { Player } from '../../types';

interface Props {
  player: Player;
}

export default function PlayerCard({ player }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={player.photo ?? '/assets/default-player.jpg'}
          alt={`${player.first_name} ${player.last_name}`}
          className="w-full h-48 object-cover bg-gray-200"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Joueur'; }}
        />
        <span className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
          #{player.jersey_number}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">
          {player.first_name} {player.last_name}
        </h3>
        <p className="text-sm text-blue-600 font-medium">{player.position}</p>
        <p className="text-xs text-gray-400 mt-1">{player.nationality}</p>
      </div>
    </div>
  );
}
