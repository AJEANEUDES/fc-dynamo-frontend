import { Link } from 'react-router-dom';
import type { Article } from '../../types';

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const date = new Date(article.published_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Link to={`/actualites/${article.slug}`} className="block">
      <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
        {article.image && (
          <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
        )}
        <div className="p-4">
          {article.category && (
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {article.category.name}
            </span>
          )}
          <h3 className="font-bold text-gray-900 mt-1 line-clamp-2">{article.title}</h3>
          <p className="text-xs text-gray-400 mt-2">{date}</p>
        </div>
      </div>
    </Link>
  );
}
