import { useGet, usePost } from '../hooks/useApi';
import type { FootballMatch, Ticket } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Tickets() {
  const { data: matches, isLoading } = useGet<FootballMatch[]>('matches', '/matches');
  const { mutateAsync: buyTicket } = usePost<Ticket, { match_id: string; quantity: number }>('/tickets', 'tickets');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const upcoming = matches?.filter((m) => m.status === 'upcoming') ?? [];

  const handleBuy = async (matchId: string) => {
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }
    await buyTicket({ match_id: matchId, quantity: 1 });
    alert('Billet acheté avec succès !');
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Billetterie</h1>
      {upcoming.length === 0 ? (
        <p className="text-gray-500">Aucun match à venir pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((m) => (
            <div key={m.id} className="bg-white border rounded-xl px-5 py-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">FC Dynamo City vs {m.opponent}</p>
                <p className="text-sm text-gray-500">
                  {new Date(m.match_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · {m.stadium}
                </p>
                <p className="text-blue-700 font-semibold text-sm mt-1">25,00 € / billet</p>
              </div>
              <button onClick={() => handleBuy(m.id)} className="bg-blue-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">
                Acheter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
