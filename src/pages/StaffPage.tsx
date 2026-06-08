import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { StaffMember } from '../types';
import { useLocalized } from '../hooks/useLocale';

export default function StaffPage() {
  const { t } = useTranslation('team');
  const { pick } = useLocalized();
  const { data: staff, isLoading } = useGet<StaffMember[]>('staff', '/staff');

  if (isLoading) return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('staff.title')}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {staff?.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 bg-[#1E3A5F]">
                <img
                  src={member.photo ?? '/assets/default-player.svg'}
                  alt={`${member.first_name} ${member.last_name}`}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = '/assets/default-player.svg'; }
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0A2342]">{member.first_name} {member.last_name}</h3>
                <p className="text-sm text-[#C0392B] font-medium mt-1">{pick(member.role_ru, member.role_en)}</p>
                <p className="text-xs text-gray-400 mt-1">{member.nationality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
