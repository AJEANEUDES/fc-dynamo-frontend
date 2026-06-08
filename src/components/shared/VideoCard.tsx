import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Video } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

interface Props {
  video: Video;
}

export function formatDuration(seconds?: number): string | null {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoCard({ video }: Props) {
  const { t } = useTranslation('videos');
  const { pick } = useLocalized();
  const duration = formatDuration(video.duration);

  return (
    <Link
      to={`/psg-tv/${video.id}`}
      className="group block bg-[#0A2342] rounded-2xl overflow-hidden
                 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-2xl"
    >
      <div className="relative h-44 bg-gradient-to-br from-[#1E3A5F] to-[#0A2342]">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={pick(video.title_ru, video.title_en)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#C8A951]/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        <span className="absolute top-3 left-3 bg-[#C8A951] text-[#0A2342] text-xs font-bold px-2 py-1 rounded-full">
          {t(`types.${video.type}`)}
        </span>

        {duration && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded">
            {duration}
          </span>
        )}

        <div className="absolute inset-0 bg-[#C0392B]/0 group-hover:bg-[#C0392B]/70 opacity-0 group-hover:opacity-100
                        transition-all duration-200 flex items-center justify-center">
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold leading-tight line-clamp-2">
          {pick(video.title_ru, video.title_en)}
        </h3>
      </div>
    </Link>
  );
}
