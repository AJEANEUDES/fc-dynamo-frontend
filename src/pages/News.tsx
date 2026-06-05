import { useGet } from '../hooks/useApi';
import type { Article } from '../types';
import ArticleCard from '../components/shared/ArticleCard';

export default function News() {
  const { data: articles, isLoading } = useGet<Article[]>('articles', '/articles');

  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Actualités</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}
