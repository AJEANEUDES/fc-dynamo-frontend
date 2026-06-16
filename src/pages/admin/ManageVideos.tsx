import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useLocalized } from '../../hooks/useLocale';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Video } from '../../types';

const VIDEO_TYPES = [
  'temps-forts',
  'no-comment',
  'emission',
  'interview',
  'carte-blanche',
] as const;

interface VideoForm {
  type: string;
  title_ru: string;
  title_en: string;
  description_ru: string;
  video_url: string;
  thumbnail: string;
  duration: string;
  published_at: string;
}

const today = () => new Date().toISOString().substring(0, 10);

const EMPTY_FORM: VideoForm = {
  type: 'temps-forts',
  title_ru: '',
  title_en: '',
  description_ru: '',
  video_url: '',
  thumbnail: '',
  duration: '',
  published_at: today(),
};

export default function ManageVideos() {
  const { t } = useTranslation('admin');
  const { formatDate } = useLocalized();
  const qc = useQueryClient();

  const { data: videos, isLoading } = useGet<Video[]>('videos', '/videos');

  const [showModal, setShowModal] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [form, setForm] = useState<VideoForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditVideo(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(v: Video) {
    setEditVideo(v);
    setForm({
      type: v.type,
      title_ru: v.title_ru,
      title_en: v.title_en ?? '',
      description_ru: v.description_ru ?? '',
      video_url: v.video_url,
      thumbnail: v.thumbnail ?? '',
      duration: v.duration != null ? String(v.duration) : '',
      published_at: v.published_at ? String(v.published_at).substring(0, 10) : today(),
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
        type: form.type,
        title_ru: form.title_ru,
        title_en: form.title_en || null,
        description_ru: form.description_ru || null,
        video_url: form.video_url,
        thumbnail: form.thumbnail || null,
        duration: form.duration ? parseInt(form.duration, 10) : null,
        published_at: form.published_at || null,
      };
      if (editVideo) {
        await api.put(`/admin/videos/${editVideo.id}`, payload);
      } else {
        await api.post('/admin/videos', payload);
      }
      qc.invalidateQueries({ queryKey: ['videos'] });
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
    await api.delete(`/admin/videos/${id}`);
    qc.invalidateQueries({ queryKey: ['videos'] });
  }

  const field = (key: keyof Omit<VideoForm, 'type'>) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('videos.title')}</h1>
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
                    <th className="px-4 py-3 text-left font-semibold">{t('videos.titleCol')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('videos.type')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('videos.published')}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(videos ?? []).map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{v.title_ru}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#0A2342]/10 text-[#0A2342] text-xs font-semibold px-2 py-0.5 rounded-full">
                          {t(`videos.types.${v.type}`, { defaultValue: v.type })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {v.published_at
                          ? formatDate(v.published_at, { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(v)}
                          className="text-[#0A2342] hover:text-[#C8A951] text-xs font-semibold transition-colors"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
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

      {showModal && (
        <Modal
          title={editVideo ? t('videos.editTitle') : t('videos.addTitle')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label={t('videos.typeLabel')} required>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className={inputCls}
              >
                {VIDEO_TYPES.map((vt) => (
                  <option key={vt} value={vt}>
                    {t(`videos.types.${vt}`, { defaultValue: vt })}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('videos.titleRu')} required>
              <input {...field('title_ru')} required className={inputCls} />
            </Field>
            <Field label={t('videos.titleEn')}>
              <input {...field('title_en')} className={inputCls} />
            </Field>
            <Field label={t('videos.descriptionRu')}>
              <textarea
                {...field('description_ru')}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label={t('videos.videoUrl')} required>
              <input {...field('video_url')} required className={inputCls} />
            </Field>
            <Field label={t('videos.thumbnail')}>
              <input {...field('thumbnail')} type="url" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('videos.duration')}>
                <input
                  {...field('duration')}
                  type="number"
                  min={0}
                  className={inputCls}
                />
              </Field>
              <Field label={t('videos.publishedAt')}>
                <input {...field('published_at')} type="date" className={inputCls} />
              </Field>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <ModalActions saving={saving} onClose={() => setShowModal(false)} t={t} />
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0A2342]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalActions({
  saving,
  onClose,
  t,
}: {
  saving: boolean;
  onClose: () => void;
  t: (k: string, opts?: Record<string, string>) => string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
      >
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

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A2342] transition-colors';
