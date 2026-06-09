import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Sponsor } from '../types';
import { useLocalized } from '../hooks/useLocale';

const TIER_ORDER = ['officiel', 'partenaire', 'fournisseur'] as const;
type Tier = (typeof TIER_ORDER)[number];

function LogoPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-10 h-10 text-[#C8A951]/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const { t } = useTranslation('sponsors');
  const { pick } = useLocalized();
  const [imgError, setImgError] = useState(false);
  const name = pick(sponsor.name_ru, sponsor.name_en);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
        {sponsor.logo && !imgError ? (
          <img
            src={sponsor.logo}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full bg-[#0A2342]">
            <LogoPlaceholder />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-[#0A2342] leading-tight">{name}</h3>
        {sponsor.website_url && (
          <a
            href={sponsor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto text-sm text-[#C0392B] hover:underline font-medium"
          >
            {t('visitSite')}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Sponsors() {
  const { t } = useTranslation('sponsors');
  const { data: sponsors, isLoading } = useGet<Sponsor[]>(['sponsors'], '/sponsors');

  const grouped = TIER_ORDER.reduce<Record<Tier, Sponsor[]>>(
    (acc, tier) => {
      acc[tier] = (sponsors ?? []).filter((s) => s.tier === tier);
      return acc;
    },
    { officiel: [], partenaire: [], fournisseur: [] }
  );

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-[#C8A951]">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>
        ) : (
          TIER_ORDER.map((tier) =>
            grouped[tier].length > 0 ? (
              <section key={tier}>
                <h2 className="text-xl font-bold text-[#0A2342] mb-1">{t(`tiers.${tier}`)}</h2>
                <div className="w-12 h-1 bg-[#C8A951] rounded mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grouped[tier].map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              </section>
            ) : null
          )
        )}
      </div>
    </div>
  );
}
