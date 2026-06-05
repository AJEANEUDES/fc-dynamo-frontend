import { useForm } from 'react-hook-form';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('Contact form:', data);
    alert('Message envoyé ! (simulation)');
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input {...register('name', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          {errors.name && <p className="text-red-500 text-xs mt-1">Champ requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" {...register('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          {errors.email && <p className="text-red-500 text-xs mt-1">Champ requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea rows={5} {...register('message', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          {errors.message && <p className="text-red-500 text-xs mt-1">Champ requis</p>}
        </div>
        <button type="submit" className="bg-blue-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-600">
          Envoyer
        </button>
      </form>
    </div>
  );
}
