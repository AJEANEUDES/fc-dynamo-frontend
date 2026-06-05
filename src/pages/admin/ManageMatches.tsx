import { useGet } from '../../hooks/useApi';
import type { FootballMatch } from '../../types';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';

export default function ManageMatches() {
  const { data: matches, isLoading } = useGet<FootballMatch[]>('matches', '/matches');
  const qc = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce match ?')) return;
    await api.delete(`/admin/matches/${id}`);
    qc.invalidateQueries({ queryKey: ['matches'] });
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des matchs</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Adversaire</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {matches?.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{new Date(m.match_date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3">{m.opponent}</td>
                <td className="px-4 py-3 font-bold">
                  {m.score_home !== null ? `${m.score_home} - ${m.score_away}` : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{m.status}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline text-xs">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
