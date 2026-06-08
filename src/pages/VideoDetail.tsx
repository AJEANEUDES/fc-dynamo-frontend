import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Video } from '../types';
import { useLocalized } from '../hooks/useLocale';
import { formatDuration } from '../components/shared/VideoCard';

export default function VideoDetail() {
  const { t } = useTranslation('videos');
  const { id } = useParams<{ id: string }>();
  const { pick, formatDate } = useLocalized();
  const { data: video, isLoading } = useGet<Video>(['video', id ?? ''], `/videos/${id}`);

  if (isLoading) return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;
  if (!video) return <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>;

  const title = pick(video.title_ru, video.title_en);
  const description = pick(video.description_ru ?? '', video.description_en);
  const duration = formatDuration(video.duration);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/psg-tv" className="text-[#C0392B] hover:underline text-sm font-medium">{t('back')}</Link>

      <div className="mt-4 relative w-full aspect-video bg-[#0A2342] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src={video.video_url}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="bg-[#C8A951] text-[#0A2342] text-xs font-bold px-3 py-1 rounded-full">
            {t(`types.${video.type}`)}
          </span>
          {duration && (
            <span className="text-gray-500">{t('duration')} : {duration}</span>
          )}
          {video.published_at && (
            <span className="text-gray-400">{t('publishedOn')} {formatDate(video.published_at)}</span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#0A2342] mt-3">{title}</h1>

        {description && (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-4">{description}</p>
        )}
      </div>
    </div>
  );
}
