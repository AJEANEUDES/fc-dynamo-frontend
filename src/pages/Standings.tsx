import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Competition, Standing } from '../types';
import { useLocalized } from '../hooks/useLocale';

export default function Standings() {
  const { t } = useTranslation('matches');
  const { pick } = useLocalized();

  const { data: competitions, isLoading: loadingCompetitions } = useQuery<Competition[]>({
    queryKey: ['competitions'],
    queryFn: () => api.get('/competitions').then((r) => r.data),
  });
  const competition = competitions?.[0];

  const { data: standings, isLoading: loadingStandings } = useQuery<Standing[]>({
    queryKey: ['standings', competition?.id],
    queryFn: () => api.get(`/standings/${competition!.id}`).then((r) => r.data),
    enabled: !!competition,
  });

  const isLoading = loadingCompetitions || (!!competition && loadingStandings);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/matchs" className="text-[#C0392B] hover:underline text-sm font-medium">{t('standings.back')}</Link>

      <h1 className="text-3xl font-bold text-[#0A2342] mt-4 mb-2">{t('standings.title')}</h1>
      {competition && (
        <p className="text-[#C8A951] font-medium mb-6">{pick(competition.name_ru, competition.name_en)} · {competition.season}</p>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>
      ) : !standings || standings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">{t('common:notFound')}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full text-sm text-center">
            <thead className="bg-[#0A2342] text-white">
              <tr>
                <th className="py-3 px-2">{t('standings.position')}</th>
                <th className="py-3 px-4 text-left">{t('standings.club')}</th>
                <th className="py-3 px-2">{t('standings.played')}</th>
                <th className="py-3 px-2">{t('standings.won')}</th>
                <th className="py-3 px-2">{t('standings.drawn')}</th>
                <th className="py-3 px-2">{t('standings.lost')}</th>
                <th className="py-3 px-2">{t('standings.goalsFor')}</th>
                <th className="py-3 px-2">{t('standings.goalsAgainst')}</th>
                <th className="py-3 px-2 font-black">{t('standings.points')}</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-bold text-[#0A2342]">{row.position}</td>
                  <td className="py-3 px-4 text-left flex items-center gap-2">
                    {row.club_logo && <img src={row.club_logo} alt="" className="w-6 h-6 object-contain" />}
                    <span className="font-medium">{pick(row.club_name_ru, row.club_name_en)}</span>
                  </td>
                  <td className="py-3 px-2">{row.played}</td>
                  <td className="py-3 px-2">{row.won}</td>
                  <td className="py-3 px-2">{row.drawn}</td>
                  <td className="py-3 px-2">{row.lost}</td>
                  <td className="py-3 px-2">{row.goals_for}</td>
                  <td className="py-3 px-2">{row.goals_against}</td>
                  <td className="py-3 px-2 font-black text-[#C0392B]">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
