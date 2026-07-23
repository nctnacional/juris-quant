import React, { useState, useEffect } from 'react';
import { ModalPlanos } from './ModalPlanos';
import { supabase } from '../lib/supabase';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planoAtual, setPlanoAtual] = useState<string>('Plano Gratuito');

  useEffect(() => {
    async function checkUserPlan() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Regra específica para testes de planos por e-mail
          if (user.email === 'ncteletrica@gmail.com') {
            setPlanoAtual('Plano Completo');
          } else if (user.email === 'eletrica2020@hotmail.com') {
            setPlanoAtual('Plano Disciplinas');
          } else {
            // Para qualquer outro usuário, verifica no banco de dados (tabela profiles)
            const { data, error } = await supabase
              .from('profiles')
              .select('plano, subscription_status')
              .eq('id', user.id)
              .single();

            if (data && !error) {
              if (data.plano) {
                setPlanoAtual(data.plano);
              } else if (data.subscription_status === 'active') {
                setPlanoAtual('Plano Completo');
              } else {
                setPlanoAtual('Plano Gratuito');
              }
            } else {
              setPlanoAtual('Plano Gratuito');
            }
          }
        }
      } catch (err) {
        console.error('Erro ao verificar plano do usuário:', err);
      }
    }

    checkUserPlan();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#0d3b22', color: '#fff', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '0.5px' }}>JURIS QUANT</h2>
          
          {/* Exibe o plano correspondente ao e-mail logado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.08)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem' }}>
            <span style={{ color: '#e2c07d', fontWeight: 600 }}>Plano Atual:</span>
            <span style={{ color: '#fff', textTransform: 'capitalize' }}>{planoAtual}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ background: '#d4af37', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#000', fontSize: '0.9rem', transition: 'filter 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            PREMIUM
          </button>

          <button 
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Sair ou trocar de conta"
          >
            Sair
          </button>
        </div>
      </header>

      <ModalPlanos isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}