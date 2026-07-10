import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell, Download, Globe, Moon, Ruler, Save, Trash2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Modal from '@/components/Modal';
import ThemeToggle from '@/components/ThemeToggle';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { ACTIVITY_LEVELS, DIET_PREFERENCES, GOALS, LANGUAGES } from '@/constants';
import { downloadJson } from '@/utils/storage';
import { todayKey } from '@/utils/date';
import { cn } from '@/utils/cn';

const AVATARS = ['🧑‍🍳', '👩‍🦰', '🧔', '👩🏽', '🧑🏿', '👱‍♀️', '🧑‍🦱', '👴', '👧'];

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  age: z.coerce.number().min(10, 'Age must be 10–100').max(100, 'Age must be 10–100'),
  heightCm: z.coerce.number().min(100, '100–250 cm').max(250, '100–250 cm'),
  weightKg: z.coerce.number().min(30, '30–300 kg').max(300, '30–300 kg'),
  goalWeightKg: z.coerce.number().min(30, '30–300 kg').max(300, '30–300 kg'),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
  goal: z.enum(['lose', 'maintain', 'gain']),
  dietPreference: z.string(),
  calorieGoal: z.coerce.number().min(1000, '≥ 1000 kcal').max(6000, '≤ 6000 kcal'),
  waterGoal: z.coerce.number().min(1, '1–20 glasses').max(20, '1–20 glasses'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { profile, updateProfile, meals, water, weights, resetAllData } = useApp();
  const { addToast } = useToast();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const onSave = handleSubmit((data) => {
    updateProfile(data);
    reset(data);
    addToast('Profile saved.');
  });

  function exportEverything() {
    downloadJson(`nutrilife-backup-${todayKey()}.json`, {
      exportedAt: new Date().toISOString(),
      profile,
      meals,
      water,
      weights,
    });
    addToast('All data exported as JSON.', 'info');
  }

  function confirmReset() {
    resetAllData();
    setResetModalOpen(false);
    addToast('All data has been reset.', 'info');
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Your details, goals and app preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Avatar + summary */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center gap-4 p-6 text-center"
            aria-labelledby="avatar-heading"
          >
            <h3 id="avatar-heading" className="sr-only">
              Profile photo
            </h3>
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-5xl shadow-soft dark:bg-primary-500/20">
              {profile.avatar}
            </span>
            <div>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{profile.email}</p>
            </div>
            <div>
              <p className="label !mb-2 text-center">Choose an avatar</p>
              <div className="flex max-w-56 flex-wrap justify-center gap-1.5">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => updateProfile({ avatar: emoji })}
                    aria-label={`Use avatar ${emoji}`}
                    aria-pressed={profile.avatar === emoji}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all hover:scale-110',
                      profile.avatar === emoji
                        ? 'bg-primary-500/20 ring-2 ring-primary-500'
                        : 'bg-gray-100 dark:bg-slate-700',
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Personal details + goals form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            onSubmit={onSave}
            noValidate
            className="card space-y-4 p-6 lg:col-span-2"
            aria-labelledby="details-heading"
          >
            <h3 id="details-heading" className="text-sm font-semibold">
              Personal details & fitness goals
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="pf-name" className="label">
                  Full name
                </label>
                <input id="pf-name" className="input" {...register('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="pf-email" className="label">
                  Email
                </label>
                <input id="pf-email" type="email" className="input" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="pf-age" className="label">
                  Age
                </label>
                <input id="pf-age" type="number" className="input text-numeric" {...register('age')} />
                {errors.age && <p className="mt-1 text-xs text-danger">{errors.age.message}</p>}
              </div>
              <div>
                <label htmlFor="pf-gender" className="label">
                  Gender
                </label>
                <select id="pf-gender" className="input" {...register('gender')}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div>
                <label htmlFor="pf-height" className="label">
                  Height (cm)
                </label>
                <input id="pf-height" type="number" className="input text-numeric" {...register('heightCm')} />
                {errors.heightCm && <p className="mt-1 text-xs text-danger">{errors.heightCm.message}</p>}
              </div>
              <div>
                <label htmlFor="pf-weight" className="label">
                  Current weight (kg)
                </label>
                <input id="pf-weight" type="number" step="0.1" className="input text-numeric" {...register('weightKg')} />
                {errors.weightKg && <p className="mt-1 text-xs text-danger">{errors.weightKg.message}</p>}
              </div>
              <div>
                <label htmlFor="pf-goal-weight" className="label">
                  Goal weight (kg)
                </label>
                <input id="pf-goal-weight" type="number" step="0.1" className="input text-numeric" {...register('goalWeightKg')} />
                {errors.goalWeightKg && (
                  <p className="mt-1 text-xs text-danger">{errors.goalWeightKg.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="pf-goal" className="label">
                  Fitness goal
                </label>
                <select id="pf-goal" className="input" {...register('goal')}>
                  {GOALS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pf-activity" className="label">
                  Activity level
                </label>
                <select id="pf-activity" className="input" {...register('activityLevel')}>
                  {ACTIVITY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pf-diet" className="label">
                  Diet preference
                </label>
                <select id="pf-diet" className="input" {...register('dietPreference')}>
                  {DIET_PREFERENCES.map((diet) => (
                    <option key={diet} value={diet}>
                      {diet}
                    </option>
                  ))}
                  {/* Keep plan names adopted from Diet Plans selectable */}
                  {!DIET_PREFERENCES.includes(profile.dietPreference) && (
                    <option value={profile.dietPreference}>{profile.dietPreference}</option>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="pf-calories" className="label">
                  Daily calorie goal (kcal)
                </label>
                <input id="pf-calories" type="number" className="input text-numeric" {...register('calorieGoal')} />
                {errors.calorieGoal && (
                  <p className="mt-1 text-xs text-danger">{errors.calorieGoal.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="pf-water" className="label">
                  Daily water goal (glasses)
                </label>
                <input id="pf-water" type="number" className="input text-numeric" {...register('waterGoal')} />
                {errors.waterGoal && (
                  <p className="mt-1 text-xs text-danger">{errors.waterGoal.message}</p>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={!isDirty}>
              <Save size={16} aria-hidden="true" /> Save changes
            </button>
          </motion.form>
        </div>

        {/* Settings */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="card p-6"
          aria-labelledby="settings-heading"
        >
          <h3 id="settings-heading" className="mb-5 text-sm font-semibold">
            Settings
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-primary-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Light / dark</p>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Reminders & nudges</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={profile.notifications}
                aria-label="Toggle notifications"
                onClick={() => updateProfile({ notifications: !profile.notifications })}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  profile.notifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                    profile.notifications ? 'left-[22px]' : 'left-0.5',
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <Ruler size={18} className="text-primary-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Units</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Weight display</p>
                </div>
              </div>
              <select
                aria-label="Units"
                className="input !w-auto !py-1.5 text-xs"
                value={profile.units}
                onChange={(e) => updateProfile({ units: e.target.value as 'metric' | 'imperial' })}
              >
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-primary-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">App language</p>
                </div>
              </div>
              <select
                aria-label="Language"
                className="input !w-auto !py-1.5 text-xs"
                value={profile.language}
                onChange={(e) => updateProfile({ language: e.target.value })}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.section>

        {/* Data management */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card flex flex-wrap items-center justify-between gap-4 p-6"
          aria-labelledby="data-heading"
        >
          <div>
            <h3 id="data-heading" className="text-sm font-semibold">
              Your data
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Everything is stored locally in your browser. Export a backup or start fresh.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={exportEverything}>
              <Download size={15} aria-hidden="true" /> Export all data
            </button>
            <button type="button" className="btn-danger" onClick={() => setResetModalOpen(true)}>
              <Trash2 size={15} aria-hidden="true" /> Reset app
            </button>
          </div>
        </motion.section>
      </div>

      {/* Reset confirmation */}
      <Modal open={resetModalOpen} onClose={() => setResetModalOpen(false)} title="Reset all data?">
        <p className="mb-5 text-sm text-gray-600 dark:text-slate-300">
          This permanently deletes your meals, water logs, weight history and profile from this
          browser. Consider exporting a backup first.
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => setResetModalOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={confirmReset}>
            Yes, reset everything
          </button>
        </div>
      </Modal>
    </PageTransition>
  );
}
