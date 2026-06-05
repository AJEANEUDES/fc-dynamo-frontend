import { useGet } from '../hooks/useApi';
import type { Player } from '../types';
import PlayerCard from '../components/shared/PlayerCard';

export default function Team() {
  const { data: players, isLoading } = useGet<Player[]>('players', '/players');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Notre équipe</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {players?.map((p) => <PlayerCard key={p.id} player={p} />)}
      </div>
    </div>
  );
}
