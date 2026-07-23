import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ModalPlanosProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalPlanos({ isOpen, onClose }: ModalPlanosProps) {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    }
    getUser();
  }, []);

  if (!isOpen) return null;

  const handleAssinar = (linkPagamentoBase: string) => {
    if (!userEmail) {
      alert("Você precisa estar logado para assinar.");
      return;
    }
    const urlComEmail = `${linkPagamentoBase}?payer.email=${encodeURIComponent(userEmail)}`;
    window.location.href = urlComEmail;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2.5rem 2rem 2rem 2rem',
        maxWidth: '750px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          &times;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#0d3b22', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Desbloqueie o JURIS QUANT</h2>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>Escolha o plano ideal para a sua aprovação.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* PLANO INTERMEDIÁRIO (DISCIPLINAS) */}
          <div style={{ 
            background: '#fff', 
            border: '1px solid #d1d5db', 
            borderRadius: '10px', 
            padding: '1.5rem', 
            width: '280px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ color: '#0d3b22', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Plano Disciplinas</h3>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111', margin: '0.8rem 0' }}>
                R$ 238,80 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>/ ano</span>
              </p>
              <ul style={{ paddingLeft: '18px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#444', lineHeight: '1.5' }}>
                <li>Acesso focado às 15 disciplinas essenciais</li>
                <li>Foco em OAB, TRE/TSE e MP</li>
                <li>Simulados direcionados</li>
              </ul>
            </div>
            <button 
              onClick={() => handleAssinar('https://mpago.la/2gCqJub')}
              style={{ 
                width: '100%', 
                padding: '0.7rem', 
                background: '#0d3b22', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              Assinar Disciplinas
            </button>
          </div>

          {/* PLANO PREMIUM (COMPLETO) */}
          <div style={{ 
            background: '#f8fafc', 
            border: '2px solid #0d3b22', 
            borderRadius: '10px', 
            padding: '1.5rem', 
            width: '280px', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '15px', 
              background: '#0d3b22', 
              color: '#fff', 
              padding: '3px 10px', 
              fontSize: '0.7rem', 
              borderRadius: '20px', 
              fontWeight: 'bold' 
            }}>
              MAIS POPULAR
            </span>
            <div>
              <h3 style={{ color: '#0d3b22', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Plano Anual Completo</h3>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111', margin: '0.8rem 0' }}>
                R$ 538,80 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>/ ano</span>
              </p>
              <ul style={{ paddingLeft: '18px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#444', lineHeight: '1.5' }}>
                <li>Acesso total a TODAS as disciplinas</li>
                <li>Todos os concursos e tribunais</li>
                <li>Questões ilimitadas e atualizadas</li>
              </ul>
            </div>
            <button 
              onClick={() => handleAssinar('https://mpago.la/11PPjtR')}
              style={{ 
                width: '100%', 
                padding: '0.7rem', 
                background: '#198754', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              Assinar Completo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}