import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Gallery as GalleryType, GalleryPhoto } from '../types';
import { useLocalized } from '../hooks/useLocale';

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-12 h-12 text-[#C8A951]/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );
}

function GalleryCard({ gallery, onOpen }: { gallery: GalleryType; onOpen: () => void }) {
  const { pick, formatDate } = useLocalized();
  const [imgError, setImgError] = useState(false);
  const title = pick(gallery.title_ru, gallery.title_en);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left bg-[#0A2342] rounded-2xl overflow-hidden
                 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-2xl"
    >
      <div className="relative h-48 bg-gradient-to-br from-[#1E3A5F] to-[#0A2342]">
        {gallery.cover_image && !imgError ? (
          <img
            src={gallery.cover_image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold leading-tight line-clamp-2">{title}</h3>
        <p className="text-[#C8A951] text-xs mt-1">{formatDate(gallery.published_at)}</p>
      </div>
    </button>
  );
}

function PhotoThumb({ photo }: { photo: GalleryPhoto }) {
  const { pick } = useLocalized();
  const [imgError, setImgError] = useState(false);
  const caption = pick(photo.caption_ru ?? '', photo.caption_en);

  return (
    <figure className="rounded-xl overflow-hidden bg-gray-100">
      <div className="relative h-40 bg-[#0A2342]">
        {!imgError ? (
          <img
            src={photo.image}
            alt={caption || ''}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      {caption && <figcaption className="text-xs text-gray-600 px-2 py-2">{caption}</figcaption>}
    </figure>
  );
}

function GalleryModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation('gallery');
  const { pick } = useLocalized();
  const { data: gallery, isLoading } = useGet<GalleryType>(['gallery', id], `/galleries/${id}`);
  const title = gallery ? pick(gallery.title_ru, gallery.title_en) : '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-[#0A2342] line-clamp-2">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="text-2xl leading-none text-gray-400 hover:text-[#C0392B] transition-colors"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{t('common:loading')}</div>
        ) : gallery?.photos && gallery.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.photos.map((photo) => (
              <PhotoThumb key={photo.id} photo={photo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">{t('common:notFound')}</div>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { t } = useTranslation('gallery');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: galleries, isLoading } = useGet<GalleryType[]>(['galleries'], '/galleries');

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-[#C8A951]">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>
        ) : galleries && galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} onOpen={() => setSelectedId(gallery.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>
        )}
      </div>

      {selectedId && <GalleryModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
