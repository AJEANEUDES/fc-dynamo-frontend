import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { t } = useTranslation('common');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (_data: FormValues) => {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-[#0A2342]">{t('contact.title')}</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {submitted && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
              {t('contact.successAlert')}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('contact.name')} <span className="text-red-500">*</span>
              </label>
              <input {...register('name', { required: true })} className={inputCls} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{t('errors.required')}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('contact.email')} <span className="text-red-500">*</span>
              </label>
              <input type="email" {...register('email', { required: true })} className={inputCls} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{t('errors.required')}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('contact.message')} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                {...register('message', { required: true })}
                className={`${inputCls} resize-none`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{t('errors.required')}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#C0392B] hover:bg-[#a93226] text-white font-bold py-3 rounded-xl transition-colors"
            >
              {t('contact.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A2342] transition-colors';
