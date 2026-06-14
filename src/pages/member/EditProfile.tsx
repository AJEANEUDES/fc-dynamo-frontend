import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function EditProfile() {
  const { t } = useTranslation('member');
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const payload: Record<string, string> = {
      first_name: firstName,
      last_name: lastName,
      email,
    };
    if (currentPassword) payload.current_password = currentPassword;
    if (newPassword) payload.password = newPassword;

    try {
      await api.put('/auth/profile', payload);
      await refreshUser();
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? t('common:errors.serverError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to="/mon-espace" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
            {t('profile.backToDashboard')}
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('profile.title')}</h1>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('profile.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('profile.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('profile.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            {/* Password change section */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">{t('profile.passwordSection')}</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('profile.currentPassword')}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('profile.newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Feedback */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                {t('profile.success')}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0A2342] hover:bg-[#1E3A5F] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {saving ? t('profile.saving') : t('profile.save')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A2342] transition-colors';
