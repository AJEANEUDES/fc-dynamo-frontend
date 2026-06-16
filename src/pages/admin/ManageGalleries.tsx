import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useLocalized } from '../../hooks/useLocale';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Gallery } from '../../types';

interface GalleryForm {
  title_ru: string;
  title_en: string;
  cover_image: string;
  published_at: string;
}

const today = () => new Date().toISOString().substring(0, 10);

const EMPTY_FORM: GalleryForm = {
  title_ru: '', title_en: '', cover_image: '', published_at: today(),
};

export default function ManageGalleries() {
  const { t } = useTranslation('admin');
  const { formatDate } = useLocalized();
  const qc = useQueryClient();

  const { data: galleries, isLoading } = useGet<Gallery[]>('galleries', '/galleries');

  const [showModal, setShowModal] = useState(false);
  const [editGallery, setEditGallery] = useState<Gallery | null>(null);
  const [form, setForm] = useState<GalleryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditGallery(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(g: Gallery) {
    setEditGallery(g);
    setForm({
      title_ru: g.title_ru,
      title_en: g.title_en ?? '',
      cover_image: g.cover_image ?? '',
      published_at: g.published_at ? String(g.published_at).substring(0, 10) : today(),
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
        title_ru: form.title_ru,
        title_en: form.title_en || null,
        cover_image: form.cover_image || null,
        published_at: form.published_at || null,
      };
      if (editGallery) {
        await api.put(`/admin/galleries/${editGallery.id}`, payload);
      } else {
        await api.post('/admin/galleries', payload);
      }
      qc.invalidateQueries({ queryKey: ['galleries'] });
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
    await api.delete(`/admin/galleries/${id}`);
    qc.invalidateQueries({ queryKey: ['galleries'] });
  }

  const field = (key: keyof GalleryForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
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
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('galleries.title')}</h1>
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
                    <th className="px-4 py-3 text-left font-semibold">{t('galleries.titleCol')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('galleries.published')}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(galleries ?? []).map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{g.title_ru}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {g.published_at
                          ? formatDate(g.published_at, { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(g)}
                          className="text-[#0A2342] hover:text-[#C8A951] text-xs font-semibold transition-colors"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
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
          title={editGallery ? t('galleries.editTitle') : t('galleries.addTitle')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label={t('galleries.titleRu')} required>
              <input {...field('title_ru')} required className={inputCls} />
            </Field>
            <Field label={t('galleries.titleEn')}>
              <input {...field('title_en')} className={inputCls} />
            </Field>
            <Field label={t('galleries.coverImage')}>
              <input {...field('cover_image')} type="url" className={inputCls} />
            </Field>
            <Field label={t('galleries.publishedAt')}>
              <input {...field('published_at')} type="date" className={inputCls} />
            </Field>
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
  t: (k: string) => string;
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
