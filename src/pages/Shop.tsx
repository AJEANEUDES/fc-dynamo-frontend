import { useGet } from '../hooks/useApi';
import type { Product } from '../types';

export default function Shop() {
  const { data: products, isLoading } = useGet<Product[]>('products', '/products');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Boutique officielle</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Pas d'image</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
              <p className="text-blue-700 font-bold mt-1">{Number(p.price).toFixed(2)} €</p>
              <p className="text-xs text-gray-400 mt-1">Stock : {p.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
