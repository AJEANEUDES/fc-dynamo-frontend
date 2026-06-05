import type { FootballMatch } from '../../types';

interface Props {
  match: FootballMatch;
}

const statusLabel: Record<FootballMatch['status'], string> = {
  upcoming: 'À venir',
  live: 'En cours',
  finished: 'Terminé',
};

const statusColor: Record<FootballMatch['status'], string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  live: 'bg-red-100 text-red-700 animate-pulse',
  finished: 'bg-gray-100 text-gray-600',
};

export default function MatchCard({ match }: Props) {
  const date = new Date(match.match_date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[match.status]}`}>
          {statusLabel[match.status]}
        </span>
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      <div className="flex items-center justify-center gap-6 my-4">
        <span className="font-bold text-blue-800">FC Dynamo City</span>
        {match.status === 'finished' || match.status === 'live' ? (
          <span className="text-2xl font-extrabold text-gray-900">
            {match.score_home} — {match.score_away}
          </span>
        ) : (
          <span className="text-lg font-bold text-gray-400">vs</span>
        )}
        <span className="font-bold text-gray-700">{match.opponent}</span>
      </div>

      <p className="text-center text-xs text-gray-400">{match.stadium}</p>
    </div>
  );
}
