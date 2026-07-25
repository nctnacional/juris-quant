import React, { useState, useEffect } from 'react';
import { fetchQuestions as fetchQuestionsFromService, Question } from '../services/questions';
import { supabase } from '../lib/supabase';

interface SimuladoProps {
  type: 'discipline' | 'focus';
  itemId: string;
  itemTitle: string;
  maxQuestions?: number;
  onBack: () => void;
}

export default function SimuladoView({ type, itemId, itemTitle, maxQuestions, onBack }: SimuladoProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [type, itemId, itemTitle, maxQuestions]);

  const loadQuestions = async () => {
    setLoading(true);
    const data = await fetchQuestionsFromService(itemTitle);
    const finalQuestions = maxQuestions ? data.slice(0, maxQuestions) : data;
    setQuestions(finalQuestions);
    setLoading(false);
  };

  const currentQ = questions[currentIndex];

  // Função corrigida para salvar na tabela correta "progresso do usuário"
  const saveProgressToDatabase = async (answeredCount: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // 1. Busca o registro atual na tabela correta "progresso do usuário"
      const { data: currentProgress, error: fetchError } = await supabase
        .from('progresso do usuário')
        .select('questions_used')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erro ao buscar progresso para atualizar:', fetchError);
        return;
      }

      const previousUsed = currentProgress ? currentProgress.questions_used : 0;
      const newTotal = previousUsed + answeredCount;

      // 2. Atualiza ou insere o novo valor acumulado
      const { error: upsertError } = await supabase
        .from('progresso do usuário')
        .upsert(
          { user_id: userId, questions_used: newTotal, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (upsertError) {
        console.error('Erro ao salvar progresso no Supabase:', upsertError);
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar progresso:', err);
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      setUserAnswers(prev => {
        const updated = { ...prev, [currentIndex]: selectedOption };
        
        if (currentIndex >= questions.length - 1) {
          const totalAnswered = Object.keys(updated).length;
          saveProgressToDatabase(totalAnswered);
        }
        
        return updated;
      });
    } else {
      if (currentIndex >= questions.length - 1) {
        const totalAnswered = Object.keys(userAnswers).length;
        saveProgressToDatabase(totalAnswered);
      }
    }

    setSelectedOption(null);
    setShowAnswer(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleAnswerClick = (letter: string) => {
    setSelectedOption(letter);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption) {
      setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));
    }
    setShowAnswer(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#0a291c' }}>
        <h2>Carregando simulado de {itemTitle}...</h2>
      </div>
    );
  }

  // TELA DE RESULTADO FINAL
  if (isFinished) {
    const totalQuestions = questions.length;
    const correctCount = questions.reduce((acc, q, index) => {
      return userAnswers[index] === q.resposta_correta ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#0a291c', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Voltar para a Tela Principal
        </button>

        <div style={{ backgroundColor: '#0a291c', color: '#ffffff', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(226, 192, 125, 0.3)' }}>
          <span style={{ color: '#e2c07d', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Simulado Concluído</span>
          <h2 style={{ fontFamily: 'serif', marginTop: '0.5rem', fontSize: '2rem' }}>{itemTitle}</h2>
          
          <div style={{ margin: '2rem 0', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.1rem', color: '#e2d9c8' }}>Você acertou</p>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#e2c07d', margin: '0.5rem 0' }}>
              {correctCount} <span style={{ fontSize: '1.5rem', color: '#ffffff' }}>/ {totalQuestions}</span>
            </p>
            <p style={{ fontSize: '1rem', color: '#d1fae5' }}>Aproveitamento de {percentage}%</p>
          </div>

          <button
            onClick={onBack}
            style={{
              backgroundColor: '#e2c07d',
              color: '#0a291c',
              fontWeight: 'bold',
              padding: '0.9rem 2rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#0a291c', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        ← Voltar para a Tela Principal
      </button>

      <div style={{ backgroundColor: '#0a291c', color: '#ffffff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(226, 192, 125, 0.3)' }}>
        <span style={{ color: '#e2c07d', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {type === 'discipline' ? 'Simulado por Disciplina' : 'Simulado por Concurso / Carreiras'}
        </span>
        <h2 style={{ fontFamily: 'serif', marginTop: '0.3rem' }}>{itemTitle}</h2>
        {questions.length > 0 && (
          <p style={{ fontSize: '0.85rem', color: '#e2d9c8', marginTop: '0.5rem' }}>
            Questão {currentIndex + 1} de {questions.length} {maxQuestions ? '(Modo Free - Limitado)' : ''}
          </p>
        )}
      </div>

      {questions.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '3rem 2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Nenhuma questão cadastrada especificamente para <strong>{itemTitle}</strong> ainda.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6', fontWeight: 500, marginBottom: '1.5rem', color: '#1f2937' }}>
            {currentQ.enunciado}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {['a', 'b', 'c', 'd'].map((letter) => {
              const optionKey = `opcao_${letter}` as keyof Question;
              const isSelected = selectedOption === letter;
              const isCorrect = currentQ.resposta_correta === letter;

              let bgColor = '#f9fafb';
              let borderColor = '#e5e7eb';

              if (showAnswer) {
                if (isCorrect) {
                  bgColor = '#d1fae5';
                  borderColor = '#10b981';
                } else if (isSelected) {
                  bgColor = '#fee2e2';
                  borderColor = '#ef4444';
                }
              } else if (isSelected) {
                bgColor = '#fef3c7';
                borderColor = '#e2c07d';
              }

              return (
                <button
                  key={letter}
                  disabled={showAnswer}
                  onClick={() => handleAnswerClick(letter)}
                  style={{
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    cursor: showAnswer ? 'default' : 'pointer',
                    fontSize: '0.95rem',
                    color: '#1f2937',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <strong style={{ textTransform: 'uppercase', marginRight: '0.5rem', color: '#0a291c' }}>{letter})</strong>
                  {currentQ[optionKey]}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showAnswer ? (
              <button
                disabled={!selectedOption}
                onClick={handleConfirmAnswer}
                style={{
                  backgroundColor: selectedOption ? '#0a291c' : '#9ca3af',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: selectedOption ? 'pointer' : 'not-allowed'
                }}
              >
                Responder
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: '#e2c07d',
                  color: '#0a291c',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {currentIndex < questions.length - 1 ? 'Próxima Questão →' : 'Finalizar Simulado'}
              </button>
            )}
          </div>

          {showAnswer && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', borderLeft: '4px solid #0a291c' }}>
              <h4 style={{ color: '#0a291c', marginBottom: '0.4rem', fontFamily: 'serif' }}>Comentário da Questão:</h4>
              <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>{currentQ.comentario}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}