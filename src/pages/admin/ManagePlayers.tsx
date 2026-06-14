import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Player, Team } from '../../types';

interface PlayerForm {
  first_name: string;
  last_name: string;
  position: string;
  position_group: string;
  jersey_number: string;
  nationality: string;
  birth_date: string;
  team_id: string;
}

const EMPTY_FORM: PlayerForm = {
  first_name: '', last_name: '', position: '', position_group: 'midfielder',
  jersey_number: '', nationality: '', birth_date: '', team_id: '',
};

const POSITION_GROUPS = ['goalkeeper', 'defender', 'midfielder', 'forward'];

export default function ManagePlayers() {
  const { t } = useTranslation('admin');
  const qc = useQueryClient();

  const { data: players, isLoading } = useGet<Player[]>('players', '/players');
  const { data: teams } = useGet<Team[]>('teams', '/teams');

  const [showModal, setShowModal] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [form, setForm] = useState<PlayerForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditPlayer(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(p: Player) {
    setEditPlayer(p);
    setForm({
      first_name: p.first_name,
      last_name: p.last_name,
      position: p.position,
      position_group: p.position_group,
      jersey_number: String(p.jersey_number),
      nationality: p.nationality,
      birth_date: p.birth_date,
      team_id: p.team_id,
    });
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, jersey_number: parseInt(form.jersey_number, 10) };
      if (editPlayer) {
        await api.put(`/admin/players/${editPlayer.id}`, payload);
      } else {
        await api.post('/admin/players', payload);
      }
      qc.invalidateQueries({ queryKey: ['players'] });
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? t('common:error', { defaultValue: 'Error' }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('confirmDelete'))) return;
    await api.delete(`/admin/players/${id}`);
    qc.invalidateQueries({ queryKey: ['players'] });
  }

  const field = (key: keyof PlayerForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
              {t('backToDashboard')}
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('players.title')}</h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> {t('create')}
          </button>
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
                    <th className="px-4 py-3 text-left font-semibold">{t('players.number')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('players.name')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('players.position')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('players.nationality')}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(players ?? []).map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-[#C0392B]">{p.jersey_number}</td>
                      <td className="px-4 py-3 font-medium">{p.first_name} {p.last_name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.position}</td>
                      <td className="px-4 py-3 text-gray-500">{p.nationality}</td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-[#0A2342] hover:text-[#C8A951] text-xs font-semibold transition-colors"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-[#C0392B] hover:underline text-xs font-semibold"
                        >
                          {t('delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editPlayer ? t('players.editTitle') : t('players.addTitle')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('players.firstName')} required>
                <input {...field('first_name')} required className={inputCls} />
              </Field>
              <Field label={t('players.lastName')} required>
                <input {...field('last_name')} required className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('players.positionLabel')} required>
                <input {...field('position')} required className={inputCls} />
              </Field>
              <Field label={t('players.positionGroup')} required>
                <select {...field('position_group')} className={inputCls}>
                  {POSITION_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('players.jerseyNumber')} required>
                <input {...field('jersey_number')} type="number" min={1} max={99} required className={inputCls} />
              </Field>
              <Field label={t('players.nationalityLabel')} required>
                <input {...field('nationality')} required className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('players.birthDate')}>
                <input {...field('birth_date')} type="date" className={inputCls} />
              </Field>
              <Field label={t('players.team')}>
                <select {...field('team_id')} className={inputCls}>
                  <option value="">—</option>
                  {(teams ?? []).map((tm) => (
                    <option key={tm.id} value={tm.id}>{tm.name_ru}</option>
                  ))}
                </select>
              </Field>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <ModalActions saving={saving} onClose={() => setShowModal(false)} t={t} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ── Shared helpers ─────────────────────────────────────── */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0A2342]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalActions({ saving, onClose, t }: { saving: boolean; onClose: () => void; t: (k: string) => string }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
        {t('cancel')}
      </button>
      <button
        type="submit"
        disabled={saving}
        className="bg-[#0A2342] hover:bg-[#1E3A5F] disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
      >
        {saving ? t('saving') : t('save')}
      </button>
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A2342] transition-colors';
