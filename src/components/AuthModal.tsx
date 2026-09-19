import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface AuthModalProps {
  currentLanguage: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    setAuthModalOpen(false);
  };

  const handleModeChange = (mode: 'login' | 'register' | 'forgot') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setAuthModalMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (authModalMode === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg(t.invalidCredentials || 'Please provide both email and password.');
        return;
      }
      setLoading(true);
      try {
        await signInWithEmail(email.trim(), password);
        handleClose();
      } catch (err: any) {
        if (
          err.code === 'auth/user-not-found' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/invalid-credential'
        ) {
          setErrorMsg(t.invalidCredentials || 'Invalid email or password.');
        } else {
          setErrorMsg(err.message || t.authErrorDefault);
        }
      } finally {
        setLoading(false);
      }
    } else if (authModalMode === 'register') {
      if (!email.trim() || !password) {
        setErrorMsg(t.invalidCredentials || 'Please complete all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg(t.weakPassword || 'Password should be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(t.passwordsDoNotMatch || 'Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        await signUpWithEmail(email.trim(), password, name.trim());
        handleClose();
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg(t.emailInUse || 'An account with this email already exists.');
        } else {
          setErrorMsg(err.message || t.authErrorDefault);
        }
      } finally {
        setLoading(false);
      }
    } else if (authModalMode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMsg(t.resetEmailSent || 'Password reset link sent! Check your inbox.');
      } catch (err: any) {
        setErrorMsg(err.message || 'Unable to send password reset email.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      handleClose();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('This domain is not authorized for Google Sign-In. Please add it to the authorized domains in the Firebase Console.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || t.authErrorDefault);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md my-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header decoration */}
        <div className="bg-emerald-700 dark:bg-emerald-800 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {authModalMode === 'login' && t.loginTitle}
                {authModalMode === 'register' && t.registerTitle}
                {authModalMode === 'forgot' && t.forgotPasswordTitle}
              </h3>
              <p className="text-xs text-emerald-100/80">KhetiNexus AI • AgriN Cloud</p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {authModalMode === 'login' && t.loginSubtitle}
            {authModalMode === 'register' && t.registerSubtitle}
            {authModalMode === 'forgot' && t.forgotPasswordSubtitle}
          </p>

          {/* Mode Switcher Tabs */}
          {authModalMode !== 'forgot' && (
            <div className="flex rounded-lg bg-stone-100 dark:bg-stone-800 p-1">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  authModalMode === 'login'
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {t.login}
              </button>
              <button
                type="button"
                id="auth-tab-register"
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  authModalMode === 'register'
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {t.register}
              </button>
            </div>
          )}

          {/* Alert Messages */}
          {errorMsg && (
            <div
              id="auth-error-alert"
              className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="auth-success-alert"
              className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label
                  htmlFor="register-name-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email-input"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
              >
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="auth-password-input"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    {t.passwordLabel}
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => handleModeChange('forgot')}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {authModalMode === 'register' && (
              <div>
                <label
                  htmlFor="confirm-password-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    id="confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {authModalMode === 'login' && t.signInBtn}
              {authModalMode === 'register' && t.signUpBtn}
              {authModalMode === 'forgot' && t.resetPasswordBtn}
            </button>
          </form>

          {/* Social Sign In (Google) */}
          {authModalMode !== 'forgot' && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-stone-700" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">or</span>
                </div>
              </div>

              <button
                id="google-signin-btn"
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{t.continueWithGoogleBtn}</span>
              </button>
            </>
          )}

          {/* Footer Back link for forgot mode */}
          {authModalMode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                id="back-to-login-link"
                onClick={() => handleModeChange('login')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                ← {t.backToLogin}
              </button>
            </div>
          )}

          {/* Footer Notice */}
          <div className="pt-2 text-center text-[10px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
            Protected by Firebase Cloud Firestore Security Rules.
          </div>
        </div>
      </div>
    </div>
  );
};
