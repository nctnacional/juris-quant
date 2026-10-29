import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email?: string;
  role: string;
  plan: string;
  created_at?: string; // Declaração da data de cadastro
}

interface AdminViewProps {
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    // Incluindo a coluna 'created_at' no select
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, plan, created_at');

    if (error) {
      console.error('Erro ao buscar perfis:', error);
    } else if (data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan })
      .eq('id', userId);

    if (error) {
      alert('Erro ao atualizar plano: ' + error.message);
    } else {
      setProfiles(prev =>
        prev.map(p => (p.id === userId ? { ...p, plan: newPlan } : p))
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#0a291c' }}>
        <h3>Carregando dados dos alunos...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0a291c', fontFamily: 'serif', margin: 0 }}>Painel de Administração de Planos</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.4rem' }}>Gerencie os acessos e planos dos alunos cadastrados</p>
          </div>
          <button
            onClick={onBack}
            style={{ backgroundColor: '#e4eae3', color: '#0a291c', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ← Voltar para a Tela Principal
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f7f2', borderBottom: '2px solid #e5e7eb', color: '#0a291c', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>USUÁRIO / EMAIL</th>
              <th style={{ padding: '1rem' }}>PAPEL</th>
              <th style={{ padding: '1rem' }}>PLANO ATUAL</th>
              <th style={{ padding: '1rem' }}>DATA DE CADASTRO</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>AÇÕES (ALTERAR PLANO)</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '0.9rem' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: '#0a291c' }}>
                  {p.email || p.id}
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{p.role}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    backgroundColor: p.plan === 'premium' ? '#0a291c' : p.plan === 'intermediario' ? '#1c523a' : '#d1dcce',
                    color: p.plan === 'free' ? '#0a291c' : '#ffffff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {p.plan}
                  </span>
                </td>

                {/* Formatação correta usando 'p.created_at' */}
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>
                  {p.created_at 
                    ? new Date(p.created_at).toLocaleDateString('pt-BR') 
                    : 'N/A'}
                </td>

                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleUpdatePlan(p.id, 'free')}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#e4eae3', color: '#0a291c', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Tornar Free
                    </button>
                    <button
                      onClick={() => handleUpdatePlan(p.id, 'intermediario')}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#1c523a', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Tornar Disciplinas
                    </button>
                    <button
                      onClick={() => handleUpdatePlan(p.id, 'premium')}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#0a291c', color: '#e2c07d', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Tornar Premium
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};