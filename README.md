# 🥗 NutriLife — Eat Smart, Live Well

A modern, production-quality diet & nutrition tracking web app built with **React 19, Vite, TypeScript, Tailwind CSS, React Router and Framer Motion**.

## Features

- **Home** — animated hero, recipe search, featured plans & recipes, nutrition tips, testimonials, CTA
- **Dashboard** — calories, macros, water, BMI, weight-goal progress, streak and a weekly summary chart
- **Recipes** — search (debounced), 9 category filters, difficulty/time/calorie filters, sorting, pagination, favorites, skeleton loading, full detail pages with ingredients checklist and per-serving nutrition
- **Diet Plans** — 8 plans (Weight Loss, Muscle Gain, Keto, Vegan, Vegetarian, Mediterranean, High Protein, Intermittent Fasting) with calories, meals, duration, benefits and foods to avoid; adopt any plan as your active goal
- **Meal Tracker** — log breakfast/lunch/dinner/snacks per day, add/edit/delete meals, quick-add from recipes with automatic calorie calculation, daily nutrition summary
- **Nutrition Calculator** — BMI, BMR (Mifflin–St Jeor), TDEE, goal-adjusted calories and a 30/40/30 macro split, visualized with charts
- **Water Tracker** — animated progress ring, +/− glasses, weekly chart, hydration reminders toggle
- **Progress** — weight, calories, protein, water and BMI trends across weekly/monthly/yearly ranges; JSON export
- **Profile** — avatar picker, personal details & goals (React Hook Form + Zod), theme, units, language, notifications, full data export and reset

Plus: dark/light theme (system-aware, no flash), full localStorage persistence (offline-first), route-level code splitting, error boundary, toasts, accessible components (labels, focus rings, aria attributes, skip link), and colorblind-validated chart palettes for both themes.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 6 + TypeScript (strict) |
| Styling | Tailwind CSS 3, custom design tokens, glassmorphism |
| Routing | React Router 7 (lazy routes) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts (theme-aware wrappers) |
| Icons | Lucide React |
| State | Context API + localStorage persistence |
| HTTP | Axios instance ready for a future backend |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build
npm run preview   # serve the production build
```

## Project structure

```
src/
  assets/        static assets
  components/    reusable UI (cards, modal, toasts, charts, …)
  pages/         route components (lazy-loaded)
  layouts/       PublicLayout (navbar+footer), AppLayout (sidebar)
  hooks/         useLocalStorage, useDebounce, usePagination, …
  services/      api.ts — mock service layer, swap for real endpoints
  context/       Theme, Toast and App (profile/meals/water/weights) providers
  utils/         calculations (BMI/BMR/TDEE), dates, storage, cn
  types/         shared domain types (mirror future API shapes)
  data/          mock recipes, diet plans, tips, testimonials
  constants/     app constants, validated chart colors, defaults
  routes/        route table with Suspense fallbacks
  styles/        Tailwind entry + design-system component classes
```

## Connecting a backend later

All data access goes through `src/services/api.ts`, which today resolves mock data with simulated latency. Replace each function body with the corresponding `api.get/post` call (an Axios instance with `VITE_API_URL` support is already configured) — types and signatures stay identical, so no page or component changes are required.
