import { useGet } from '../hooks/useApi';
import type { FootballMatch } from '../types';
import MatchCard from '../components/shared/MatchCard';

export default function Matches() {
  const { data: matches, isLoading } = useGet<FootballMatch[]>('matches', '/matches');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  const upcoming = matches?.filter((m) => m.status === 'upcoming') ?? [];
  const past = matches?.filter((m) => m.status === 'finished') ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Matchs</h1>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Prochains matchs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Résultats récents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
