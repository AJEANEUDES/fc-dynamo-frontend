import { Link } from 'react-router-dom';
import { useGet } from '../hooks/useApi';
import type { Article, FootballMatch } from '../types';
import ArticleCard from '../components/shared/ArticleCard';
import MatchCard from '../components/shared/MatchCard';

export default function Home() {
  const { data: matches } = useGet<FootballMatch[]>('matches', '/matches');
  const { data: articles } = useGet<Article[]>('articles', '/articles');

  const nextMatch = matches?.find((m) => m.status === 'upcoming');
  const latestArticles = articles?.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">FC Dynamo City</h1>
        <p className="text-xl text-blue-200 mb-8">Passion · Travail · Victoire</p>
        <div className="flex justify-center gap-4">
          <Link to="/matchs" className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300">
            Voir les matchs
          </Link>
          <Link to="/billets" className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-900">
            Acheter des billets
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Prochain match */}
        {nextMatch && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prochain match</h2>
            <div className="max-w-lg">
              <MatchCard match={nextMatch} />
            </div>
          </section>
        )}

        {/* Dernières actualités */}
        {latestArticles && latestArticles.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Dernières actualités</h2>
              <Link to="/actualites" className="text-blue-600 hover:underline text-sm">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
