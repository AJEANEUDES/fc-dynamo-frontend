import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Article } from '../types';
import { useLocalized } from '../hooks/useLocale';

export default function NewsDetail() {
  const { t } = useTranslation('news');
  const { slug } = useParams<{ slug: string }>();
  const { pick, formatDate } = useLocalized();
  const { data: articles, isLoading } = useGet<Article[]>('articles', '/articles');

  const article = articles?.find((a) => a.slug === slug);

  if (isLoading) return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;
  if (!article) return <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>;

  const title = pick(article.title_ru, article.title_en);
  const content = pick(article.content_ru, article.content_en);
  const categoryName = article.category ? pick(article.category.name_ru, article.category.name_en) : null;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/actualites" className="text-[#C0392B] hover:underline text-sm font-medium">{t('back')}</Link>

      {article.image && (
        <img src={article.image} alt={title} className="w-full h-72 object-cover rounded-2xl shadow-lg mt-4" />
      )}

      <div className="mt-6">
        {categoryName && (
          <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wide">{categoryName}</span>
        )}
        <h1 className="text-3xl font-bold text-[#0A2342] mt-2">{title}</h1>
        <p className="text-sm text-gray-400 mt-2">{t('publishedOn')} {formatDate(article.published_at)}</p>
      </div>

      <div className="prose max-w-none mt-6 text-gray-700 whitespace-pre-line leading-relaxed">
        {content}
      </div>
    </article>
  );
}
