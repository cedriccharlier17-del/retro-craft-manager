'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080d09',
        color: '#fff',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#101712',
          border: '1px solid #202a22',
          borderRadius: 14,
          padding: 32,
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              color: '#9acd32',
              fontWeight: 800,
              fontSize: 24,
              marginBottom: 4,
            }}
          >
            ⚒ Retro Craft
          </div>

          <div style={{ color: '#849087' }}>MANAGER</div>
        </div>

        <h1 style={{ fontSize: 26, marginBottom: 8 }}>Connexion</h1>

        <p style={{ color: '#849087', marginBottom: 28 }}>
          Connectez-vous à votre espace de crafts partagé.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            Adresse e-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="votre@email.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: 13,
              marginBottom: 18,
              borderRadius: 7,
              border: '1px solid #29332b',
              background: '#080d09',
              color: '#fff',
            }}
          />

          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            Mot de passe
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: 13,
              marginBottom: 18,
              borderRadius: 7,
              border: '1px solid #29332b',
              background: '#080d09',
              color: '#fff',
            }}
          />

          {error && (
            <p
              style={{
                color: '#ff7777',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              border: 0,
              borderRadius: 7,
              background: '#9acd32',
              color: '#0a0e0b',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}
