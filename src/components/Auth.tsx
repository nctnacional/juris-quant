import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Cadastro
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) alert(error.message);
      else alert('Cadastro realizado com sucesso! Verifique seu e-mail.');
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#0d3524', borderRadius: '16px', color: '#ffffff', border: '1px solid rgba(226, 192, 125, 0.3)' }}>
      <h2 style={{ fontFamily: 'serif', color: '#e2c07d', marginBottom: '1.5rem', textAlign: 'center' }}>
        {isSignUp ? 'Criar Conta no Juris Quant' : 'Acessar a Plataforma'}
      </h2>

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isSignUp && (
          <div>
            <label style={{ fontSize: '0.85rem', color: '#e2d9c8' }}>Nome Completo</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.3rem' }}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.85rem', color: '#e2d9c8' }}>E-mail</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.3rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#e2d9c8' }}>Senha</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.3rem' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ backgroundColor: '#e2c07d', color: '#0a291c', fontWeight: 'bold', padding: '0.85rem', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '1rem' }}
        >
          {loading ? 'Carregando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#e2d9c8' }}>
        {isSignUp ? 'Já possui uma conta?' : 'Ainda não tem conta?'}{' '}
        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={{ background: 'none', border: 'none', color: '#e2c07d', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Entrar' : 'Cadastre-se'}
        </button>
      </p>
    </div>
  );
}