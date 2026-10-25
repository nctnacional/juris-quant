import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email?: string
  role?: string
  plan?: string
}

interface AdminViewProps {
  onBack: () => void
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [mensagem, setMensagem] = useState<string | null>(null)

  const fetchProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')

    if (error) {
      console.error('Erro ao buscar perfis:', error.message)
      setMensagem(`Erro ao buscar: ${error.message}`)
    } else if (data) {
      setProfiles(data as UserProfile[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  // Função para alterar o plano do usuário no banco de dados
  const handlePlanChange = async (userId: string, newPlan: 'free' | 'intermediario' | 'premium') => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan })
      .eq('id', userId)

    if (error) {
      setMensagem(`Erro ao atualizar plano: ${error.message}`)
    } else {
      setMensagem('Plano atualizado com sucesso!')
      setProfiles(prev =>
        prev.map(p => (p.id === userId ? { ...p, plan: newPlan } : p))
      )
    }

    setTimeout(() => setMensagem(null), 3000)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #c7d3c5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a291c', fontWeight: 'bold', fontFamily: 'serif' }}>Painel de Administração de Planos</h1>
          <p style={{ fontSize: '0.9rem', color: '#4a5449' }}>Gerencie os acessos e planos dos alunos cadastrados</p>
        </div>
        <button
          onClick={onBack}
          style={{ padding: '0.6rem 1.2rem', background: '#e4eae3', color: '#0a291c', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ← Voltar para a Tela Principal
        </button>
      </div>

      {mensagem && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#d1dcce', color: '#0a291c', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#4a5449' }}>Carregando usuários...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e4eae3', background: '#f8f7f2', color: '#0a291c', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>ID / Perfil</th>
                <th style={{ padding: '0.75rem' }}>Papel</th>
                <th style={{ padding: '0.75rem' }}>Plano Atual</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações (Alterar Plano)</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e4eae3', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem', color: '#1f2937', fontWeight: 500 }}>
                    {user.email || user.id}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4a5449' }}>
                    {user.role || 'user'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: user.plan === 'premium' ? '#0a291c' : user.plan === 'intermediario' ? '#1c523a' : '#d1dcce',
                        color: user.plan === 'free' || !user.plan ? '#0a291c' : '#ffffff'
                      }}
                    >
                      {(user.plan || 'free').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handlePlanChange(user.id, 'free')}
                        style={{ padding: '0.3rem 0.6rem', background: '#d1dcce', color: '#0a291c', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Tornar Free
                      </button>
                      <button
                        onClick={() => handlePlanChange(user.id, 'intermediario')}
                        style={{ padding: '0.3rem 0.6rem', background: '#1c523a', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        Tornar Disciplinas
                      </button>
                      <button
                        onClick={() => handlePlanChange(user.id, 'premium')}
                        style={{ padding: '0.3rem 0.6rem', background: '#0a291c', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
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
      )}
    </div>
  )
}