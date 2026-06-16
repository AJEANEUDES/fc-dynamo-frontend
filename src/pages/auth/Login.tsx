import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/mon-espace');
    } catch {
      setError(t('auth:login.error'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('auth:login.title')}</h1>
        {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('auth:login.email')}</label>
            <input id="email" type="email" {...register('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('auth:login.password')}</label>
            <input id="password" type="password" {...register('password', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{t('common:errors.required')}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#0A2342] text-white font-bold py-2 rounded-lg hover:bg-[#1E3A5F] disabled:opacity-50">
            {isSubmitting ? t('auth:login.submitting') : t('auth:login.submit')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('auth:login.noAccount')}{' '}
          <Link to="/inscription" className="text-[#0A2342] hover:underline font-medium">{t('auth:login.register')}</Link>
        </p>
      </div>
    </div>
  );
}
