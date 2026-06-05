import { useGet } from '../../hooks/useApi';
import type { Player } from '../../types';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';

export default function ManagePlayers() {
  const { data: players, isLoading } = useGet<Player[]>('players', '/players');
  const qc = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce joueur ?')) return;
    await api.delete(`/admin/players/${id}`);
    qc.invalidateQueries({ queryKey: ['players'] });
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des joueurs</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Poste</th>
              <th className="px-4 py-3 text-left">Nationalité</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-blue-700">{p.jersey_number}</td>
                <td className="px-4 py-3">{p.first_name} {p.last_name}</td>
                <td className="px-4 py-3 text-gray-500">{p.position}</td>
                <td className="px-4 py-3 text-gray-500">{p.nationality}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">
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
