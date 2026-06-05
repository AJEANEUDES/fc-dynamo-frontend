export default function Press() {
  const communiques = [
    { title: 'Bilan de saison 2025-2026', date: '2026-05-20', file: '#' },
    { title: 'Nouveau partenariat SportEquip', date: '2026-05-10', file: '#' },
    { title: 'Rénovation du stade', date: '2026-05-15', file: '#' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Espace Presse</h1>
      <p className="text-gray-600 mb-8">Retrouvez ici tous nos communiqués officiels téléchargeables.</p>
      <div className="space-y-3">
        {communiques.map((c) => (
          <div key={c.title} className="flex items-center justify-between bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold text-gray-900">{c.title}</p>
              <p className="text-xs text-gray-400">{new Date(c.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <a href={c.file} className="text-blue-600 font-semibold text-sm hover:underline">
              Télécharger (PDF)
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
