import { useGet } from '../../hooks/useApi';
import type { Article } from '../../types';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';

export default function ManageArticles() {
  const { data: articles, isLoading } = useGet<Article[]>('articles', '/articles');
  const qc = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/admin/articles/${id}`);
    qc.invalidateQueries({ queryKey: ['articles'] });
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des articles</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Publié le</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles?.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-gray-500">{a.category?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(a.published_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline text-xs">
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
