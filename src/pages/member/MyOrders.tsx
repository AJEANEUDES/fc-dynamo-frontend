import { useGet } from '../../hooks/useApi';
import type { Order } from '../../types';

const statusLabel: Record<Order['status'], string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  cancelled: 'Annulée',
};

export default function MyOrders() {
  const { data: orders, isLoading } = useGet<Order[]>('orders', '/orders');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>
      {orders?.length === 0 ? (
        <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="space-y-3">
          {orders?.map((o) => (
            <div key={o.id} className="bg-white border rounded-xl px-5 py-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Commande #{o.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">{Number(o.total).toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">{statusLabel[o.status]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
