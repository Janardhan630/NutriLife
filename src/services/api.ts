import axios from 'axios';
import { recipes } from '@/data/recipes';
import { dietPlans } from '@/data/dietPlans';
import type { DietPlan, Recipe } from '@/types';

/**
 * Service layer for all data access.
 *
 * Today the app is fully offline and serves mock data with a simulated
 * network delay so loading states are visible. When a backend exists,
 * replace the bodies below with `api.get(...)` calls — the signatures
 * and types stay the same, so no page or component changes are needed.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
});

/** Simulated network latency so skeletons/loading states are exercised. */
function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRecipes(): Promise<Recipe[]> {
  await delay();
  // Future: return (await api.get<Recipe[]>('/recipes')).data;
  return recipes;
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  await delay(300);
  // Future: return (await api.get<Recipe>(`/recipes/${id}`)).data;
  return recipes.find((r) => r.id === id);
}

export async function getDietPlans(): Promise<DietPlan[]> {
  await delay();
  // Future: return (await api.get<DietPlan[]>('/diet-plans')).data;
  return dietPlans;
}

export async function getDietPlanById(id: string): Promise<DietPlan | undefined> {
  await delay(300);
  return dietPlans.find((p) => p.id === id);
}
