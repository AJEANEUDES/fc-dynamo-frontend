import { useGet } from '../../hooks/useApi';
import type { Ticket } from '../../types';

export default function MyTickets() {
  const { data: tickets, isLoading } = useGet<Ticket[]>('tickets', '/tickets');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes billets</h1>
      {tickets?.length === 0 ? (
        <p className="text-gray-500">Vous n'avez pas encore acheté de billets.</p>
      ) : (
        <div className="space-y-3">
          {tickets?.map((t) => (
            <div key={t.id} className="bg-white border rounded-xl px-5 py-4 shadow-sm">
              <p className="font-bold text-gray-900">FC Dynamo City vs {t.match?.opponent}</p>
              <p className="text-sm text-gray-500">
                {t.match?.match_date && new Date(t.match.match_date).toLocaleDateString('fr-FR')} · {t.quantity} billet(s) · {Number(t.total_price).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
