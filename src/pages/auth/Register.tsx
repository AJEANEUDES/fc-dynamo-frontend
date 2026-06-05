import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    try {
      setError('');
      await registerUser(data.name, data.email, data.password, data.password_confirmation);
      navigate('/mon-espace');
    } catch {
      setError('Erreur lors de l\'inscription. L\'email est peut-être déjà utilisé.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h1>
        {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input {...register('name', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.name && <p className="text-red-500 text-xs mt-1">Champ requis</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.email && <p className="text-red-500 text-xs mt-1">Champ requis</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe (min. 8 caractères)</label>
            <input type="password" {...register('password', { required: true, minLength: 8 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">Minimum 8 caractères</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input type="password" {...register('password_confirmation', {
              required: true,
              validate: (v) => v === password || 'Les mots de passe ne correspondent pas',
            })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
            {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-blue-600 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
