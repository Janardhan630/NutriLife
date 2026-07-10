export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Mitchell',
    role: 'Lost 12 kg in 6 months',
    avatar: '👩‍🦰',
    quote:
      'NutriLife made calorie tracking feel effortless. The meal tracker and water reminders kept me consistent for the first time ever.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'David Chen',
    role: 'Marathon runner',
    avatar: '🧔',
    quote:
      'The nutrition calculator nailed my fueling needs. I hit a personal best two months after dialing in my macros here.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Priya Sharma',
    role: 'New to healthy eating',
    avatar: '👩🏽',
    quote:
      'I love the recipes — quick, delicious, and the nutrition info is right there. The progress charts keep me motivated every week.',
    rating: 4.5,
  },
];
