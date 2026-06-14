import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalized } from '../../hooks/useLocale';
import api from '../../api/axios';
import type { FootballMatch, Competition } from '../../types';

interface MatchForm {
  competition_id: string;
  opponent: string;
  home_away: 'home' | 'away';
  match_date: string;
  stadium: string;
  status: 'upcoming' | 'live' | 'finished';
  score_home: string;
  score_away: string;
}

const EMPTY_FORM: MatchForm = {
  competition_id: '', opponent: '', home_away: 'home',
  match_date: '', stadium: '', status: 'upcoming',
  score_home: '', score_away: '',
};

const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  live:     'bg-green-100 text-green-700',
  finished: 'bg-gray-100 text-gray-600',
};

export default function ManageMatches() {
  const { t } = useTranslation('admin');
  const { formatDate } = useLocalized();
  const qc = useQueryClient();

  const { data: matches, isLoading } = useGet<FootballMatch[]>('matches', '/matches');
  const { data: competitions } = useGet<Competition[]>('competitions', '/competitions');

  const [showModal, setShowModal] = useState(false);
  const [editMatch, setEditMatch] = useState<FootballMatch | null>(null);
  const [form, setForm] = useState<MatchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditMatch(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(m: FootballMatch) {
    setEditMatch(m);
    setForm({
      competition_id: m.competition_id,
      opponent: m.opponent,
      home_away: m.home_away,
      match_date: m.match_date.substring(0, 16),
      stadium: m.stadium,
      status: m.status,
      score_home: m.score_home !== null ? String(m.score_home) : '',
      score_away: m.score_away !== null ? String(m.score_away) : '',
    });
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        score_home: form.score_home !== '' ? parseInt(form.score_home, 10) : null,
        score_away: form.score_away !== '' ? parseInt(form.score_away, 10) : null,
      };
      if (editMatch) {
        await api.put(`/admin/matches/${editMatch.id}`, payload);
      } else {
        await api.post('/admin/matches', payload);
      }
      qc.invalidateQueries({ queryKey: ['matches'] });
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('confirmDelete'))) return;
    await api.delete(`/admin/matches/${id}`);
    qc.invalidateQueries({ queryKey: ['matches'] });
  }

  const field = (key: keyof MatchForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
              {t('backToDashboard')}
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('matches.title')}</h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> {t('create')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse h-64" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0A2342] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{t('matches.date')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('matches.opponent')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('matches.score')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('matches.status')}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(matches ?? []).map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(m.match_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {m.home_away === 'home' ? '' : '@ '}{m.opponent}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#0A2342]">
                        {m.score_home !== null ? `${m.score_home} – ${m.score_away}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[m.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {t(`matches.${m.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(m)} className="text-[#0A2342] hover:text-[#C8A951] text-xs font-semibold transition-colors">
                          {t('edit')}
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="text-[#C0392B] hover:underline text-xs font-semibold">
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

      {showModal && (
        <Modal
          title={editMatch ? t('matches.editTitle') : t('matches.addTitle')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label={t('matches.competition')} required>
              <select {...field('competition_id')} required className={inputCls}>
                <option value="">—</option>
                {(competitions ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name_ru}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('matches.opponentLabel')} required>
                <input {...field('opponent')} required className={inputCls} />
              </Field>
              <Field label={t('matches.homeAway')} required>
                <select {...field('home_away')} className={inputCls}>
                  <option value="home">{t('matches.home')}</option>
                  <option value="away">{t('matches.away')}</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('matches.matchDate')} required>
                <input {...field('match_date')} type="datetime-local" required className={inputCls} />
              </Field>
              <Field label={t('matches.stadium')} required>
                <input {...field('stadium')} required className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label={t('matches.statusLabel')} required>
                <select {...field('status')} className={inputCls}>
                  <option value="upcoming">{t('matches.upcoming')}</option>
                  <option value="live">{t('matches.live')}</option>
                  <option value="finished">{t('matches.finished')}</option>
                </select>
              </Field>
              <Field label={t('matches.scoreHome')}>
                <input {...field('score_home')} type="number" min={0} className={inputCls} />
              </Field>
              <Field label={t('matches.scoreAway')}>
                <input {...field('score_away')} type="number" min={0} className={inputCls} />
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
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
        {t('cancel')}
      </button>
      <button type="submit" disabled={saving} className="bg-[#0A2342] hover:bg-[#1E3A5F] disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors">
        {saving ? t('saving') : t('save')}
      </button>
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A2342] transition-colors';
