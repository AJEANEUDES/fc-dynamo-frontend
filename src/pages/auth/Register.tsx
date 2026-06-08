import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  birth_date: string;
}

export default function Register() {
  const { t } = useTranslation(['auth', 'common']);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    try {
      setError('');
      await registerUser(
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.password_confirmation,
        data.birth_date,
      );
      navigate('/confirmation');
    } catch {
      setError(t('auth:register.error'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('auth:register.title')}</h1>
        {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.firstName')}</label>
              <input {...register('first_name', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.lastName')}</label>
              <input {...register('last_name', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.email')}</label>
            <input type="email" {...register('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.birthDate')}</label>
            <input type="date" {...register('birth_date', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.birth_date && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.password')}</label>
            <input type="password" {...register('password', { required: true, minLength: 8 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{t('common:errors.passwordTooShort')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth:register.confirmPassword')}</label>
            <input type="password" {...register('password_confirmation', {
              required: true,
              validate: (v) => v === password || t('common:errors.passwordMismatch'),
            })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#0A2342] text-white font-bold py-2 rounded-lg hover:bg-[#1E3A5F] disabled:opacity-50">
            {isSubmitting ? t('auth:register.submitting') : t('auth:register.submit')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('auth:register.hasAccount')}{' '}
          <Link to="/connexion" className="text-[#0A2342] hover:underline font-medium">{t('auth:register.login')}</Link>
        </p>
      </div>
    </div>
  );
}
