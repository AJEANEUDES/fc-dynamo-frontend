export default function Club() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Le Club</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3">Notre histoire</h2>
        <p className="text-gray-700 leading-relaxed">
          Fondé en 1985, le FC Dynamo City est né de la passion de quelques amateurs de football du quartier de la Dynamique. Depuis ses humbles débuts en championnat régional, le club n'a cessé de grandir pour s'imposer aujourd'hui comme une référence nationale.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Passion', desc: 'Le football est notre raison d\'être.' },
            { label: 'Travail', desc: 'L\'excellence se construit chaque jour.' },
            { label: 'Victoire', desc: 'Gagner ensemble, pour nos supporters.' },
          ].map((v) => (
            <div key={v.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <h3 className="font-bold text-blue-800 text-lg">{v.label}</h3>
              <p className="text-gray-600 text-sm mt-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-800 mb-3">Palmarès</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2"><span className="text-yellow-500">🏆</span> Champion de Ligue 1 — 2019</li>
          <li className="flex items-center gap-2"><span className="text-yellow-500">🏆</span> Coupe Nationale — 2021, 2023</li>
          <li className="flex items-center gap-2"><span className="text-gray-400">🥈</span> Vice-Champion — 2024, 2026</li>
        </ul>
      </section>
    </div>
  );
}
