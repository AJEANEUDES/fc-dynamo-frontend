import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Video } from '../types';
import VideoCard from '../components/shared/VideoCard';

const TABS = ['all', 'temps-forts', 'no-comment', 'emission', 'interview'] as const;
type Tab = (typeof TABS)[number];

export default function PSGTV() {
  const { t } = useTranslation('videos');
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const url = activeTab === 'all' ? '/videos' : `/videos?type=${activeTab}`;
  const { data: videos, isLoading } = useGet<Video[]>(['videos', activeTab], url);

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-[#C8A951]">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-[#C0392B] text-white'
                  : 'bg-gray-100 text-[#0A2342] hover:bg-gray-200'
              }`}
            >
              {t(`types.${tab}`)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>
        )}
      </div>
    </div>
  );
}
