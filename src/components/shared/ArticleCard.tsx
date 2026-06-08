import { Link } from 'react-router-dom';
import type { Article } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const { pick, formatDate } = useLocalized();
  const title = pick(article.title_ru, article.title_en);
  const categoryName = article.category ? pick(article.category.name_ru, article.category.name_en) : null;

  return (
    <Link to={`/actualites/${article.slug}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200">
        {article.image && (
          <div className="overflow-hidden">
            <img
              src={article.image}
              alt={title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="p-4">
          {categoryName && (
            <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wide">
              {categoryName}
            </span>
          )}
          <h3 className="font-bold text-[#0A2342] mt-1 line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-400 mt-2">{formatDate(article.published_at)}</p>
        </div>
      </div>
    </Link>
  );
}
