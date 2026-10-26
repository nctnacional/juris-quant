import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DisciplineOption {
  id: string;
  title: string;
}

const allDisciplines: DisciplineOption[] = [
  { id: 'ied', title: 'Introdução ao Estudo do Direito' },
  { id: 'historia', title: 'História do Direito' },
  { id: 'sociologia', title: 'Sociologia Jurídica' },
  { id: 'filosofia', title: 'Filosofia do Direito e Antropologia' },
  { id: 'const', title: 'Direito Constitucional' },
  { id: 'admin', title: 'Direito Administrativo' },
  { id: 'penal', title: 'Direito Penal' },
  { id: 'proc-penal', title: 'Direito Processual Penal' },
  { id: 'finan-trib', title: 'Direito Financeiro e Tributário' },
  { id: 'civil', title: 'Direito Civil' },
  { id: 'proc-civil', title: 'Direito Processual Civil' },
  { id: 'consumidor', title: 'Direito do Consumidor' },
  { id: 'empresa', title: 'Direito Empresarial' },
  { id: 'trabalho', title: 'Direito do Trabalho' },
  { id: 'proc-trabalho', title: 'Direito Processual do Trabalho' },
  { id: 'previdenciario', title: 'Direito Previdenciário' },
  { id: 'eca', title: 'ECA (Criança e Adolescente)' },
  { id: 'ambiental', title: 'Direito Ambiental' },
  { id: 'internacional', title: 'Direito Internacional' },
  { id: 'mediacao', title: 'Mediação, Conciliação e Arbitragem' },
  { id: 'digital', title: 'Direito Digital & LGPD' },
  { id: 'eleitoral', title: 'Direito Eleitoral (Foco TRE)' },
  { id: 'etica', title: 'Ética Profissional (OAB)' },
];

interface CustomSimuladoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onStartCustomSimulado: (questions: any[], simuladoTitle: string) => void;
}

export const CustomSimuladoModal: React.FC<CustomSimuladoModalProps> = ({
  isOpen,
  onClose,
  userId,
  onStartCustomSimulado,
}) => {
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleDiscipline = (id: string) => {
    setErrorMsg(null);
    if (selectedDisciplines.includes(id)) {
      setSelectedDisciplines(selectedDisciplines.filter(d => d !== id));
    } else {
      if (selectedDisciplines.length >= 3) {
        setErrorMsg('Pode selecionar no máximo 3 disciplinas para o simulado personalizado.');
        return;
      }
      setSelectedDisciplines([...selectedDisciplines, id]);
    }
  };

  const handleGenerateSimulado = async () => {
    if (selectedDisciplines.length === 0) {
      setErrorMsg('Selecione pelo menos 1 disciplina.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: historyData, error: historyError } = await supabase
        .from('user_question_history')
        .select('question_id')
        .eq('user_id', userId);

      if (historyError) {
        console.error('Erro ao buscar histórico:', historyError);
      }

      const answeredIds = historyData ? historyData.map(h => h.question_id) : [];

      let query = supabase
        .from('questoes')
        .select('*')
        .in('discipline_id', selectedDisciplines);

      if (answeredIds.length > 0) {
        query = query.not('id', 'in', `(${answeredIds.join(',')})`);
      }

      const { data: questionsData, error: qError } = await query.limit(100);

      if (qError) {
        throw new Error(qError.message);
      }

      if (!questionsData || questionsData.length === 0) {
        setErrorMsg('Não há questoes inéditas disponíveis nestas disciplinas para o seu histórico. Tente outras disciplinas ou limpe o histórico.');
        setLoading(false);
        return;
      }

      const shuffled = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 100);

      const newHistoryEntries = shuffled.map(q => ({
        user_id: userId,
        question_id: q.id.toString(),
      }));

      const { error: insertHistoryError } = await supabase
        .from('user_question_history')
        .insert(newHistoryEntries);

      if (insertHistoryError) {
        console.error('Erro ao registrar histórico do simulado:', insertHistoryError);
      }

      setLoading(false);
      onStartCustomSimulado(shuffled, `Simulado Personalizado (${selectedDisciplines.length} Disciplinas)`);
      onClose();
    } catch (err: any) {
      console.error('Erro ao gerar simulado:', err);
      setErrorMsg(`Erro ao gerar simulado: ${err.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '650px',
        width: '100%', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0a291c', fontFamily: 'serif' }}>Criar Simulado Personalizado</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#4a5449', marginBottom: '1.5rem' }}>
          Selecione <strong>até 3 disciplinas</strong>. O sistema gerará um simulado inteligente de até 100 questões exclusivas, **sem repetir perguntas que você já respondeu anteriormente**.
        </p>

        {errorMsg && (
          <div style={{ backgroundColor: '#fde8e8', color: '#9b1c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {allDisciplines.map(disc => {
            const isSelected = selectedDisciplines.includes(disc.id);
            return (
              <div
                key={disc.id}
                onClick={() => handleToggleDiscipline(disc.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #0a291c' : '1px solid #c7d3c5',
                  backgroundColor: isSelected ? '#d1dcce' : '#f8f7f2',
                  color: '#0a291c',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <span>{disc.title}</span>
                <span>{isSelected ? '✓' : '+'}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.75rem 1.5rem', background: '#e4eae3', color: '#0a291c', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerateSimulado}
            disabled={loading || selectedDisciplines.length === 0}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedDisciplines.length === 0 ? '#cccccc' : '#0a291c',
              color: '#e2c07d',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: selectedDisciplines.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'A gerar simulado inédito...' : `Gerar Simulado (${selectedDisciplines.length}/3)`}
          </button>
        </div>
      </div>
    </div>
  );
};