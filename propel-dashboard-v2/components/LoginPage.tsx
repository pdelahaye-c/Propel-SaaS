import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Input, Card, CardContent, cn } from './ui';
import { useTheme } from './ThemeProvider';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';

export function LoginPage() {
  const { login, register, error, clearError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register({ email, password, firstName, lastName });
      } else {
        await login(email, password);
      }
    } catch {
      // Error is already in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    clearError();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
      >
        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <span className="text-3xl font-bold text-foreground tracking-tight">Propel</span>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-center mb-1">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-muted text-center mb-6">
              {isRegister
                ? 'Start managing your real estate business'
                : 'Sign in to your dashboard'}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-800 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                    <Input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Jean"
                      required={isRegister}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                    <Input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Dupont"
                      required={isRegister}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={isRegister ? 'Min. 6 characters' : 'Enter your password'}
                    required
                    minLength={isRegister ? 6 : undefined}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Loading...'
                  : isRegister
                    ? 'Create account'
                    : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
              </span>{' '}
              <button
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </div>

            {!isRegister && (
              <div className="mt-4 p-3 rounded-md bg-surface border border-border text-xs text-muted">
                <strong className="text-foreground">Demo credentials:</strong>
                <br />admin@propel.app / password123
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
