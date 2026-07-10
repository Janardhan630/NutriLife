import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Leaf, LogIn, UserPlus } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'At least 6 characters'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

type Mode = 'signin' | 'signup';

/** Sign in / sign up page. Redirects back to the page that required auth. */
export default function Login() {
  const [mode, setMode] = useState<Mode>('signin');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, register: registerAccount } = useAuth();
  const { updateProfile } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  /** Where to go after auth — the page that redirected here, or the dashboard. */
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const signIn = useForm<SignInForm>({ resolver: zodResolver(signInSchema) });
  const signUp = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) });

  const onSignIn = signIn.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
      addToast('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Sign in failed.');
    }
  });

  const onSignUp = signUp.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await registerAccount(data.name, data.email, data.password);
      // Keep the nutrition profile in sync with the new account
      updateProfile({ name: data.name, email: data.email });
      addToast(`Account created — welcome, ${data.name.split(' ')[0]}! 🎉`);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Sign up failed.');
    }
  });

  function switchMode(next: Mode) {
    setMode(next);
    setSubmitError(null);
  }

  const inputError = 'mt-1 text-xs text-danger';

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 via-[#F8FAFC] to-[#F8FAFC] p-4 dark:from-primary-500/10 dark:via-[#0F172A] dark:to-[#0F172A]">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Home
      </Link>

      <motion.main
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-500 text-white shadow-soft">
            <Leaf size={26} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {mode === 'signin'
                ? 'Sign in to continue your healthy journey.'
                : 'Join NutriLife — free forever, data stays on your device.'}
            </p>
          </div>
        </div>

        {/* Mode switch */}
        <div className="mb-6 grid grid-cols-2 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900/40" role="tablist" aria-label="Authentication mode">
          {(
            [
              { value: 'signin', label: 'Sign in' },
              { value: 'signup', label: 'Sign up' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={mode === tab.value}
              onClick={() => switchMode(tab.value)}
              className={cn(
                'rounded-full py-2 text-sm font-semibold transition-colors',
                mode === tab.value
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-gray-600 hover:text-primary-600 dark:text-slate-300',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {submitError && (
          <p role="alert" className="mb-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {submitError}
          </p>
        )}

        {mode === 'signin' ? (
          <form onSubmit={onSignIn} className="space-y-4" noValidate>
            <div>
              <label htmlFor="si-email" className="label">
                Email
              </label>
              <input id="si-email" type="email" autoComplete="email" className="input" placeholder="you@example.com" {...signIn.register('email')} />
              {signIn.formState.errors.email && <p className={inputError}>{signIn.formState.errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="si-password" className="label">
                Password
              </label>
              <input id="si-password" type="password" autoComplete="current-password" className="input" placeholder="••••••••" {...signIn.register('password')} />
              {signIn.formState.errors.password && <p className={inputError}>{signIn.formState.errors.password.message}</p>}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={signIn.formState.isSubmitting}>
              <LogIn size={16} aria-hidden="true" /> Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={onSignUp} className="space-y-4" noValidate>
            <div>
              <label htmlFor="su-name" className="label">
                Full name
              </label>
              <input id="su-name" autoComplete="name" className="input" placeholder="Alex Morgan" {...signUp.register('name')} />
              {signUp.formState.errors.name && <p className={inputError}>{signUp.formState.errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="su-email" className="label">
                Email
              </label>
              <input id="su-email" type="email" autoComplete="email" className="input" placeholder="you@example.com" {...signUp.register('email')} />
              {signUp.formState.errors.email && <p className={inputError}>{signUp.formState.errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="su-password" className="label">
                  Password
                </label>
                <input id="su-password" type="password" autoComplete="new-password" className="input" placeholder="Min 6 chars" {...signUp.register('password')} />
                {signUp.formState.errors.password && <p className={inputError}>{signUp.formState.errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="su-confirm" className="label">
                  Confirm
                </label>
                <input id="su-confirm" type="password" autoComplete="new-password" className="input" placeholder="Repeat it" {...signUp.register('confirm')} />
                {signUp.formState.errors.confirm && <p className={inputError}>{signUp.formState.errors.confirm.message}</p>}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={signUp.formState.isSubmitting}>
              <UserPlus size={16} aria-hidden="true" /> Create account
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
          Demo auth — your account and data never leave this browser.
        </p>
      </motion.main>
    </div>
  );
}
