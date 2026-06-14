import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalized } from '../../hooks/useLocale';
import api from '../../api/axios';
import type { User } from '../../types';

const ROLES: User['role'][] = ['visiteur', 'membre', 'staff', 'journaliste', 'admin'];

const ROLE_STYLES: Record<string, string> = {
  admin:       'bg-red-100 text-red-700',
  staff:       'bg-purple-100 text-purple-700',
  journaliste: 'bg-yellow-100 text-yellow-700',
  membre:      'bg-blue-100 text-blue-700',
  visiteur:    'bg-gray-100 text-gray-600',
};

export default function ManageUsers() {
  const { t } = useTranslation('admin');
  const { formatDate } = useLocalized();
  const qc = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: users, isLoading } = useGet<User[]>('admin-users', '/admin/users');

  async function handleRoleChange(userId: string, role: string) {
    setUpdating(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
              {t('backToDashboard')}
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('users.title')}</h1>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse h-64" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0A2342] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{t('users.name')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('users.email')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('users.role')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('users.since')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('users.changeRole')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(users ?? []).map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[#0A2342]">
                        {u.first_name || u.name} {u.last_name ?? ''}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_STYLES[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(u.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={updating === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#0A2342] disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
