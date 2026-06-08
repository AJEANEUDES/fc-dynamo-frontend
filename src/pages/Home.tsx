import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Article, FootballMatch } from '../types';
import ArticleCard from '../components/shared/ArticleCard';
import MatchCard from '../components/shared/MatchCard';

export default function Home() {
  const { t } = useTranslation('home');
  const { data: matches } = useGet<FootballMatch[]>('matches', '/matches');
  const { data: articles } = useGet<Article[]>('articles', '/articles');

  const nextMatch = matches?.find((m) => m.status === 'upcoming');
  const latestArticles = articles?.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A2342] to-[#1E3A5F] text-white py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">{t('hero.title')}</h1>
        <p className="text-xl text-[#C8A951] mb-8">{t('hero.slogan')}</p>
        <div className="flex justify-center gap-4">
          <Link to="/matchs" className="bg-[#C8A951] text-[#0A2342] font-bold px-6 py-3 rounded-lg hover:bg-[#dfc06f] transition-colors">
            {t('hero.watchMatches')}
          </Link>
          <Link to="/billets" className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-[#0A2342] transition-colors">
            {t('hero.buyTickets')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Prochain match */}
        {nextMatch && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A2342] mb-4">{t('nextMatch')}</h2>
            <div className="max-w-lg">
              <MatchCard match={nextMatch} />
            </div>
          </section>
        )}

        {/* Dernières actualités */}
        {latestArticles && latestArticles.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#0A2342]">{t('latestNews')}</h2>
              <Link to="/actualites" className="text-[#C0392B] hover:underline text-sm font-medium">{t('viewAll')}</Link>
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
