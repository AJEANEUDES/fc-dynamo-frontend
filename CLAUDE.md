# CLAUDE.md — fc-dynamo-frontend

> Ce fichier est chargé automatiquement par Claude Code à chaque session.
> Ne jamais supprimer. Mettre à jour si une décision architecturale change.

---

## Présentation du projet

**Nom :** FC Dynamo City — Site Web Club de Football (inspiré PSG)
**Dépôt :** `github.com/AJEANEUDES/fc-dynamo-frontend`
**Framework :** React 19 + TypeScript + Vite
**Styling :** Tailwind CSS 3
**Design system :** UX UI Pro Max (installé dans `.claude/skills/ui-ux-pro-max/`)
**i18n :** react-i18next (russe par défaut)
**API :** Axios → `http://localhost:8000/api/v1`
**Contexte :** Projet de Fin d'Études (PFE) en Informatique

---

## Langue — Contrainte critique

- 🇷🇺 **Russe = langue par DÉFAUT** — `lng: 'ru'`, `fallbackLng: 'ru'`
- 🇬🇧 **Anglais = option toggle** — `localStorage.getItem('fc_lang')`
- **ZÉRO texte cyrillique codé en dur** dans les composants `.tsx`
- Tout texte affiché passe par `useTranslation()` et les fichiers JSON
- La langue est envoyée à l'API via le header `Accept-Language`
- Le toggle 🇷🇺/🇬🇧 est dans la Navbar, persisté dans `localStorage` (clé : `fc_lang`)

---

## Commandes essentielles

```bash
# Démarrer le serveur de développement
npm run dev                              # http://localhost:3000

# Build production
npm run build                            # Génère dist/
npm run preview                          # Prévisualiser le build

# Tests
npm run test                             # Tous les tests (Vitest)
npm run test -- --coverage               # Avec couverture (objectif ≥ 70%)
npm run test -- --watch                  # Mode watch
npm run test -- NomDuFichier             # Test spécifique

# E2E
npx playwright test                      # Tous les E2E
npx playwright test --ui                 # Interface graphique
npx playwright test language.spec.ts     # Test langue uniquement

# i18n — vérification
bash scripts/check-i18n.sh              # 0 cyrillique codé en dur

# Lint
npm run lint                             # ESLint
```

---

## Architecture & Conventions

### Structure des dossiers importants

```
src/
├── locales/
│   ├── ru/              ← 🇷🇺 RUSSE — fichiers JSON OBLIGATOIRES
│   │   ├── common.json  ← Nav, footer, boutons, statuts, erreurs
│   │   ├── home.json
│   │   ├── team.json
│   │   ├── matches.json
│   │   ├── shop.json
│   │   ├── auth.json
│   │   └── admin.json
│   └── en/              ← 🇬🇧 ANGLAIS — même structure que ru/
├── api/
│   └── axios.ts         ← Intercepteurs token + Accept-Language auto
├── components/
│   ├── layout/          ← Navbar (avec toggle RU/EN) + Footer
│   ├── ui/              ← Composants UX UI Pro Max
│   └── shared/          ← PlayerCard, MatchCard, ArticleCard, VideoCard
├── context/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx  ← Gestion RU/EN + persistance localStorage
├── hooks/
│   ├── useAuth.ts
│   └── useLocale.ts
├── pages/               ← Une page par section du site
├── types/
│   └── index.ts         ← Interfaces TypeScript (Player, Article, etc.)
└── router/
    └── AppRouter.tsx    ← Routes + guards RequireAuth + RequireAdmin
```

### Règles absolues — À respecter sans exception

1. **0 texte cyrillique en dur** — toujours `t('clé')` via react-i18next
2. **UX UI Pro Max obligatoire** — vérifier que `.claude/skills/ui-ux-pro-max/` existe avant tout code UI
3. **Types TypeScript** — jamais de `any`. Toujours une interface explicite
4. **Accept-Language** — l'intercepteur Axios envoie automatiquement la langue courante
5. **Tailwind uniquement** — pas de CSS inline, pas de fichiers .css séparés sauf `index.css`
6. **Palette couleurs** :
   - Navy PSG : `#0A2342` (`bg-[#0A2342]`)
   - Rouge PSG : `#C0392B` (`bg-[#C0392B]`)
   - Or : `#C8A951` (`text-[#C8A951]`)
   - Vert : `#0D6B4A`
7. **Polices cyrilliques** — uniquement Roboto ou Inter (Google Fonts). Jamais de police sans support cyrillique
8. **Composants bilingues** — toujours accepter `lang` ou utiliser `useLanguage()`
9. **Commits conventionnels** — `feat:`, `fix:`, `chore:`, `test:`, `style:`
10. **Responsive mobile-first** — tester à 375px (mobile) ET 1440px (desktop)

---

## Design System — UX UI Pro Max

### Installation (si pas encore fait)

```bash
npm install -g uipro-cli
uipro init --ai claude
# OU dans Claude Code :
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

### Générer le design system football

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "football club sports dark navy premium" \
  --design-system -p "FC Dynamo City"
```

### Tokens de design

| Token | Valeur | Usage |
|---|---|---|
| Couleur primaire | `#0A2342` | Navbar, headers, fonds sombres |
| Couleur accent | `#C0392B` | Boutons CTA, highlights |
| Or/Premium | `#C8A951` | Badges VIP, palmares |
| Succès | `#0D6B4A` | Confirmations, disponibilité |
| Police titres | Roboto 700-900 | Support cyrillique ✅ |
| Police corps | Inter / Roboto 400 | Lisibilité RU/EN |
| Border radius | `rounded-2xl` (16px) | Cartes, modals |
| Shadow | `shadow-lg` | Cartes en hover |

---

## Internationalisation — Rappel rapide

### Utilisation dans un composant

```tsx
// ✅ CORRECT
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('common');
return <button>{t('buttons.buyTicket')}</button>;
// → Affiche "Купить билет" (RU) ou "Buy Ticket" (EN)

// ❌ INCORRECT — texte codé en dur
return <button>Купить билет</button>;
```

### Obtenir la langue courante

```tsx
import { useLanguage } from '../context/LanguageContext';
const { locale, toggleLanguage, isRussian } = useLanguage();
// locale = 'ru' ou 'en'
// isRussian = true si langue = 'ru'
```

### Champ bilingue depuis l'API

```tsx
// L'API retourne déjà le bon champ selon Accept-Language
// Mais si nécessaire en local :
const name = locale === 'en' ? (player.name_en ?? player.name_ru) : player.name_ru;
```

---

## Composants à créer (par priorité)

### INC 0 — Obligatoires avant tout
- `Navbar.tsx` (avec toggle 🇷🇺/🇬🇧)
- `Footer.tsx`
- `LanguageContext.tsx`
- `AuthContext.tsx`
- `AppRouter.tsx` (avec RequireAuth + RequireAdmin)
- `axios.ts` (intercepteurs complets)

### INC 1 — Pages publiques
- `Home.tsx`, `News.tsx`, `NewsDetail.tsx`
- `Team.tsx`, `PlayerDetail.tsx`, `StaffPage.tsx`
- `Matches.tsx`, `MatchDetail.tsx`, `Standings.tsx`
- `PlayerCard.tsx`, `MatchCard.tsx`, `ArticleCard.tsx`

### INC 2 — Contenu enrichi
- `PSGTV.tsx`, `VideoDetail.tsx`, `Gallery.tsx`
- `Club.tsx`, `Stadium.tsx`, `Campus.tsx`

### INC 3 — Commerce
- `Ticketing.tsx`, `TicketCalendar.tsx`
- `StadiumTour.tsx`, `TourBooking.tsx`
- `Shop.tsx`, `ProductDetail.tsx` (avec flocage cyrillique)
- `Cart.tsx`, `Checkout.tsx`

### INC 4 — Admin
- `Admin/Dashboard.tsx`, `Admin/ManagePlayers.tsx`
- `Admin/ManageMatches.tsx`, `Admin/ManageArticles.tsx`
- `Admin/ManageStore.tsx`, `Admin/ManageUsers.tsx`

---

## Variables d'environnement

```env
# .env.local
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME="FC Dynamo City"
VITE_DEFAULT_LOCALE=ru
```

---

## Parcours utilisateur principal (référence démo)

```
1. Accueil (Главная) — en russe
2. Clic toggle → passe en anglais
3. Navigation vers Équipes (Teams)
4. Clic sur un joueur → fiche détaillée
5. Retour → Billetterie → Купить билет
6. Redirect vers Connexion (non-auth)
7. Inscription → Nouveau profil → Confirmation
8. Achat billet → panier → confirmation
9. Admin → panel de gestion
```

---

## Documentation de référence

Lire avant toute implémentation :

- `PHASE_4_IMPLEMENTATION.md` → Guide complet (code composants, config i18n, Axios)
- `PHASE_5_TESTS.md` → Tests Vitest + Playwright à écrire
- `PHASE_3_CONCEPTION.md` (docx) → Architecture, structure projets, design system
- `PHASE_2_ANALYSE_BESOINS.md` (docx) → User stories + critères d'acceptation

---

## Si une information manque

**STOP — Ne jamais deviner.**
Situations → STOP :
- Clé i18n manquante dans le fichier JSON → demander avant de coder en dur
- Composant UX UI Pro Max non trouvé → vérifier `.claude/skills/ui-ux-pro-max/`
- Doute sur le comportement du toggle langue
- Incertitude sur la structure d'un type TypeScript
