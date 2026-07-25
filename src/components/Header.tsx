import React from 'react';

interface HeaderProps {
  userPlan: 'free' | 'intermediario' | 'premium';
  questionsUsed?: number; // Quantas questões o usuário já respondeu ou visualizou
  onOpenPlans: () => void;
  onLogout: () => void;
}

export default function Header({ userPlan, questionsUsed = 0, onOpenPlans, onLogout }: HeaderProps) {
  const getPlanName = () => {
    if (userPlan === 'premium') return 'Plano Premium';
    if (userPlan === 'intermediario') return 'Plano Disciplinas';
    return 'Plano Gratuito';
  };

  return (
    <header style={{
      backgroundColor: '#0a291c',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(226, 192, 125, 0.2)',
      color: '#ffffff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '1.25rem', margin: 0, letterSpacing: '1px' }}>
          JURIS <span style={{ color: '#e2c07d' }}>QUANT</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Informações do Plano e Contador de Questões */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#e2c07d' }}>Plano Atual:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffffff' }}>
              {getPlanName()}
            </span>
          </div>

          {/* Contador de questões disponíveis visível apenas no Plano Gratuito */}
          {userPlan === 'free' && (
            <div style={{ 
              backgroundColor: 'rgba(226, 192, 125, 0.15)', 
              border: '1px solid rgba(226, 192, 125, 0.3)', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#e2d9c8',
              textAlign: 'center'
            }}>
              <span>{questionsUsed} de 150 questões</span>
            </div>
          )}
        </div>

        {/* Botão de Upgrade (aparece se não for Premium) */}
        {userPlan !== 'premium' && (
          <button
            onClick={onOpenPlans}
            style={{
              backgroundColor: '#e2c07d',
              color: '#0a291c',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textTransform: 'uppercase'
            }}
          >
            {userPlan === 'intermediario' ? 'Upgrade Premium' : 'Premium'}
          </button>
        )}

        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}