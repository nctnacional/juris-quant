import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email?: string
  role?: string
  plan?: string
  papel?: string
  plano?: string
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
    // Busca os perfis sem ordenar por colunas que possam não existir
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Atualiza tanto 'role' como 'papel' por segurança contra divergências na base de dados
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, papel: newRole })
      .eq('id', userId)

    if (error) {
      setMensagem(`Erro ao atualizar: ${error.message}`)
    } else {
      setMensagem('Permissão atualizada com sucesso!')
      setProfiles(prev =>
        prev.map(p => (p.id === userId ? { ...p, role: newRole, papel: newRole } : p))
      )
    }

    setTimeout(() => setMensagem(null), 3000)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #c7d3c5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a291c', fontWeight: 'bold', fontFamily: 'serif' }}>Painel de Administração</h1>
          <p style={{ fontSize: '0.9rem', color: '#4a5449' }}>Gerencie os níveis de acesso dos alunos cadastrados</p>
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
                <th style={{ padding: '0.75rem' }}>Papel / Role</th>
                <th style={{ padding: '0.75rem' }}>Plano Atual</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e4eae3', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem', color: '#1f2937', fontWeight: 500 }}>
                    {user.email || user.id}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4a5449' }}>
                    {user.role || user.papel || 'user'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: (user.role === 'admin' || user.papel === 'admin') ? '#7c3aed' : '#0a291c',
                        color: '#ffffff'
                      }}
                    >
                      {(user.plan || user.plano || 'free').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        style={{ padding: '0.3rem 0.6rem', background: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Tornar Admin
                      </button>
                      <button
                        onClick={() => handleRoleChange(user.id, 'user')}
                        style={{ padding: '0.3rem 0.6rem', background: '#d1dcce', color: '#0a291c', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Tornar User
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