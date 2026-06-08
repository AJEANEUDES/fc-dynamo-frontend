import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Player, Team as TeamType } from '../types';
import PlayerCard from '../components/shared/PlayerCard';

const POSITION_ORDER = ['gardien', 'défenseur', 'milieu', 'attaquant'];

export default function Team() {
  const { t } = useTranslation('team');

  const { data: teams, isLoading: loadingTeams } = useQuery<TeamType[]>({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams').then((r) => r.data),
  });
  const menTeam = teams?.find((tm) => tm.slug === 'football-masculin');

  const { data: players, isLoading: loadingPlayers } = useQuery<Player[]>({
    queryKey: ['players', menTeam?.id],
    queryFn: () => api.get(`/players?team_id=${menTeam!.id}`).then((r) => r.data),
    enabled: !!menTeam,
  });

  const isLoading = loadingTeams || (!!menTeam && loadingPlayers);

  const grouped = (players ?? []).reduce<Record<string, Player[]>>((acc, p) => {
    (acc[p.position_group] ??= []).push(p);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">{t('common:loading')}</div>;
  }

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-[#C8A951]">{t('subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {POSITION_ORDER.map((group) => {
          const groupPlayers = grouped[group] ?? [];
          if (groupPlayers.length === 0) return null;
          return (
            <section key={group} className="mb-12">
              <h2 className="text-2xl font-bold text-[#0A2342] mb-6 pb-2 border-b-4 border-[#C0392B]">
                {t(`positions.${group}`)}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupPlayers.map((p) => <PlayerCard key={p.id} player={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
