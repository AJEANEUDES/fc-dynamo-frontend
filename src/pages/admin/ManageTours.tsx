import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Tour } from '../../types';

interface TourForm {
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
  price_adult: string;
  price_child: string;
  image: string;
  is_active: boolean;
}

const EMPTY_FORM: TourForm = {
  name_ru: '', name_en: '', description_ru: '', description_en: '',
  price_adult: '', price_child: '', image: '', is_active: true,
};

export default function ManageTours() {
  const { t } = useTranslation('admin');
  const qc = useQueryClient();

  const { data: tours, isLoading } = useGet<Tour[]>('tours', '/tours');

  const [showModal, setShowModal] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<TourForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditTour(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(tour: Tour) {
    setEditTour(tour);
    setForm({
      name_ru: tour.name_ru,
      name_en: tour.name_en ?? '',
      description_ru: tour.description_ru ?? '',
      description_en: tour.description_en ?? '',
      price_adult: String(tour.price_adult),
      price_child: String(tour.price_child),
      image: tour.image ?? '',
      is_active: tour.is_active,
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
        name_en: form.name_en || null,
        description_ru: form.description_ru || null,
        description_en: form.description_en || null,
        image: form.image || null,
        price_adult: parseFloat(form.price_adult),
        price_child: parseFloat(form.price_child),
      };
      if (editTour) {
        await api.put(`/admin/tours/${editTour.id}`, payload);
      } else {
        await api.post('/admin/tours', payload);
      }
      qc.invalidateQueries({ queryKey: ['tours'] });
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
    await api.delete(`/admin/tours/${id}`);
    qc.invalidateQueries({ queryKey: ['tours'] });
  }

  const field = (key: keyof Omit<TourForm, 'is_active'>) => ({
    value: form[key] as string,
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
            <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('tours.title')}</h1>
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
                    <th className="px-4 py-3 text-left font-semibold">{t('tours.name')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('tours.priceAdult')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('tours.priceChild')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('tours.active')}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(tours ?? []).map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{tour.name_ru}</td>
                      <td className="px-4 py-3 font-semibold text-[#0A2342]">
                        {Number(tour.price_adult).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {Number(tour.price_child).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            tour.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {tour.is_active ? '✓' : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(tour)}
                          className="text-[#0A2342] hover:text-[#C8A951] text-xs font-semibold transition-colors"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
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
          title={editTour ? t('tours.editTitle') : t('tours.addTitle')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label={t('tours.nameRu')} required>
              <input {...field('name_ru')} required className={inputCls} />
            </Field>
            <Field label={t('tours.nameEn')}>
              <input {...field('name_en')} className={inputCls} />
            </Field>
            <Field label={t('tours.descriptionRu')}>
              <textarea {...field('description_ru')} rows={3} className={`${inputCls} resize-none`} />
            </Field>
            <Field label={t('tours.descriptionEn')}>
              <textarea {...field('description_en')} rows={2} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('tours.priceAdultLabel')} required>
                <input
                  {...field('price_adult')}
                  type="number"
                  step="0.01"
                  min={0}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label={t('tours.priceChildLabel')} required>
                <input
                  {...field('price_child')}
                  type="number"
                  step="0.01"
                  min={0}
                  required
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label={t('tours.imageLabel')}>
              <input {...field('image')} type="url" className={inputCls} />
            </Field>
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                {t('tours.isActive')}
              </label>
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
