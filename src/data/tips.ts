export interface NutritionTip {
  id: string;
  emoji: string;
  title: string;
  text: string;
}

export const nutritionTips: NutritionTip[] = [
  {
    id: 'tip-protein',
    emoji: '🍳',
    title: 'Front-load your protein',
    text: 'Eating 25–30 g of protein at breakfast reduces cravings and keeps you full well into the afternoon.',
  },
  {
    id: 'tip-water',
    emoji: '💧',
    title: 'Drink before you snack',
    text: 'Thirst is often mistaken for hunger. Have a glass of water and wait 10 minutes before reaching for a snack.',
  },
  {
    id: 'tip-plate',
    emoji: '🥗',
    title: 'Use the half-plate rule',
    text: 'Fill half your plate with vegetables, a quarter with protein, and a quarter with whole grains for balanced meals.',
  },
  {
    id: 'tip-sleep',
    emoji: '😴',
    title: 'Sleep is a nutrient',
    text: 'Less than 7 hours of sleep raises hunger hormones the next day. Protect your bedtime like a workout.',
  },
];
