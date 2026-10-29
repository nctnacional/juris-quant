import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import SimuladoView from './components/SimuladoView';
import Header from './components/Header';
import { ModalPlanos } from './components/ModalPlanos';
import { AdminView } from './components/AdminView';
import { CustomSimuladoModal } from './components/CustomSimuladoModal';

interface Discipline {
  id: string;
  number: string;
  title: string;
  count: string;
  description: string;
}

interface FocusTarget {
  id: string;
  badge: string;
  title: string;
  description: string;
}

const disciplinesData: Discipline[] = [
  { id: 'ied', number: '01', title: 'Introdução ao Estudo do Direito', count: '380+ questões', description: 'Fontes do direito, norma jurídica, hermenêutica, vigência e ordenamento.' },
  { id: 'historia', number: '02', title: 'História do Direito', count: '210+ questões', description: 'Evolução histórica dos sistemas jurídicos, direito romano e codificação.' },
  { id: 'sociologia', number: '03', title: 'Sociologia Jurídica', count: '250+ questões', description: 'Eficácia social da norma, controle social, pluralismo e conflitos sociais.' },
  { id: 'filosofia', number: '04', title: 'Filosofia do Direito e Antropologia', count: '310+ questões', description: 'Jusnaturalismo, positivismo, ética jurídica, justiça e diversidade cultural.' },
  { id: 'const', number: '05', title: 'Direito Constitucional', count: '1.200+ questões', description: 'Princípios fundamentais, direitos e garantias, organização do Estado.' },
  { id: 'admin', number: '06', title: 'Direito Administrativo', count: '1.300+ questões', description: 'Atos, contratos administrativos, licitações, agentes e improbidade.' },
  { id: 'penal', number: '07', title: 'Direito Penal', count: '980+ questões', description: 'Teoria geral do crime, penas, excludentes e crimes em espécie.' },
  { id: 'proc-penal', number: '08', title: 'Direito Processual Penal', count: '890+ questões', description: 'Inquérito policial, ação penal, provas, prisões cautelares e recursos.' },
  { id: 'finan-trib', number: '09', title: 'Direito Financeiro e Tributário', count: '850+ questões', description: 'Sistema Tributário Nacional, CTN, receita pública, LRF e tributos.' },
  { id: 'civil', number: '10', title: 'Direito Civil', count: '1.450+ questões', description: 'Pessoas, bens, negócios jurídicos, contratos, família e sucessões.' },
  { id: 'proc-civil', number: '11', title: 'Direito Processual Civil', count: '1.100+ questões', description: 'Jurisdição, ação, tutelas provisórias, processo de conhecimento e recursos.' },
  { id: 'consumidor', number: '12', title: 'Direito do Consumidor', count: '520+ questões', description: 'CDC, direitos básicos, responsabilidade pelo fato/vício e práticas abusivas.' },
  { id: 'empresa', number: '13', title: 'Direito Empresarial', count: '540+ questões', description: 'Teoria da empresa, S/A, títulos de crédito, falência e recuperação.' },
  { id: 'trabalho', number: '14', title: 'Direito do Trabalho', count: '750+ questões', description: 'CLT, contrato individual de trabalho, jornada, remuneração e rescisão.' },
  { id: 'proc-trabalho', number: '15', title: 'Direito Processual do Trabalho', count: '620+ questões', description: 'Organização da Justiça do Trabalho, dissídios, execução e recursos.' },
  { id: 'previdenciario', number: '16', title: 'Direito Previdenciário', count: '640+ questões', description: 'Seguridade social, RGPS, benefícios, custeio e carência.' },
  { id: 'eca', number: '17', title: 'ECA (Criança e Adolescente)', count: '480+ questões', description: 'Direitos fundamentais, ato infracional, medidas protetivas e adoção.' },
  { id: 'ambiental', number: '18', title: 'Direito Ambiental', count: '430+ questões', description: 'Princípios ambientais, licenciamento, responsabilidade e crimes ambientais.' },
  { id: 'internacional', number: '19', title: 'Direito Internacional', count: '390+ questões', description: 'Direito Internacional Público, Privado, Tratados e Direitos Humanos.' },
  { id: 'mediacao', number: '20', title: 'Mediação, Conciliação e Arbitragem', count: '320+ questões', description: 'Métodos adequados de solução de conflitos, Lei de Arbitragem e Métodos Consensuais.' },
  { id: 'digital', number: '21', title: 'Direito Digital & LGPD', count: '310+ questões', description: 'Marco Civil da Internet, LGPD, crimes cibernéticos e IA.' },
  { id: 'eleitoral', number: '22', title: 'Direito Eleitoral (Foco TRE)', count: '580+ questões', description: 'Direitos políticos, inelegividades, partidos e ilícitos eleitorais.' },
  { id: 'etica', number: '23', title: 'Ética Profissional (OAB)', count: '450+ questões', description: 'Estatuto da Advocacia, Regulamento Geral e Código de Ética.' },
];

const specialFocusData: FocusTarget[] = [
  { id: 'oab', badge: 'Exame de Ordem', title: 'Exame da OAB', description: 'Foco total em Ética, Constitucional, Civil, Penal, Trabalhista, CDC e Prática Profissional.' },
  { id: 'tre', badge: 'Justiça Eleitoral', title: 'Concurso TRE / TSE', description: 'Simulados focados em Direito Eleitoral, Constitucional, Administrativo, Regimentos e LRF.' },
  { id: 'tj', badge: 'Justiça Estadual', title: 'Tribunais de Justiça (TJ)', description: 'Simulados para Juiz de Direito, Analista e Técnico (Processo Civil, Penal e Organização Judiciária).' },
  { id: 'mp', badge: 'Ministério Público', title: 'Ministério Público (MP)', description: 'Questões para Promotor de Justiça e Analista (Direitos Difusos, Coletivos, ECA, Penal e Processo Penal).' },
  { id: 'procuradoria', badge: 'Advocacia Pública', title: 'Procuradorias (PGE / PGM / AGU)', description: 'Foco aprofundado em Direito Administrativo, Tributário, Financeiro, Processo Civil e Constitucional.' },
  { id: 'jf', badge: 'Justiça Federal', title: 'Justiça Federal (TRF)', description: 'Preparo específico para Juiz Federal, Analista e Técnico (Tributário, Previdenciário e Constitucional).' },
  { id: 'stj-stf', badge: 'Tribunais Superiores', title: 'STJ & STF', description: 'Questões de alto nível com ênfase em Jurisprudência, Súmulas Vinculantes e Controle de Constitucionalidade.' },
  { id: 'defensoria', badge: 'Defesa Pública', title: 'Defensoria Pública (DPE / DPU)', description: 'Simulados com foco em Direitos Humanos, Execução Penal, ECA, Consumidor e Tutela Coletiva.' },
  { id: 'delegado', badge: 'Carreiras Policiais', title: 'Delegado de Polícia (PC / PF)', description: 'Foco total em Penal Especial, Processual Penal, Criminologia, Medicina Legal e Leis Penais Especiais.' }
];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionsUsed, setQuestionsUsed] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<string>('premium');
  const [isAdminUser, setIsAdminUser] = useState<boolean>(true);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [activeSimulado, setActiveSimulado] = useState<{
    type: 'discipline' | 'focus' | 'custom';
    id: string;
    title: string;
    questions?: any[];
    isFreeLimit?: boolean;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        fetchUserData(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        fetchUserData(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const userEmail = session?.user?.email;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, plan')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError.message);
      }

      if (userEmail === 'ncteletrica@gmail.com' || (profileData && profileData.role === 'admin')) {
        setIsAdminUser(true);
        setUserPlan('premium');
      } else {
        setIsAdminUser(false);
        if (profileData && profileData.plan) {
          setUserPlan(profileData.plan.toLowerCase().trim());
        } else {
          setUserPlan('free');
        }
      }

      const { data: progressData, error: progressError } = await supabase
        .from('progresso do usuário')
        .select('questions_used')
        .eq('user_id', userId)
        .single();

      if (progressData) {
        setQuestionsUsed(progressData.questions_used);
      } else if (progressError && progressError.code === 'PGRST116') {
        await supabase.from('progresso do usuário').insert([{ user_id: userId, questions_used: 0 }]);
        setQuestionsUsed(0);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setIsAdminUser(true);
      setUserPlan('premium');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#0a291c', fontFamily: 'sans-serif' }}>
        <h2>A carregar...</h2>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ backgroundColor: '#f8f7f2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <Auth />
        </div>
      </div>
    );
  }

  const isFree = userPlan === 'free';
  const isIntermediario = userPlan === 'intermediario';

  const handleFocusClick = (item: FocusTarget) => {
    if (isIntermediario && item.id !== 'oab' && item.id !== 'tre') {
      alert('O seu plano atual ("Plano Disciplinas") dá acesso às disciplinas, OAB e TRE. Faça o upgrade para o Plano Completo para desbloquear as demais preparações especiais!');
      return;
    }

    if (isFree) {
      alert('Esta área de Foco Especial é exclusiva para planos superiores. Faça o upgrade para ter acesso completo!');
      return;
    }

    setActiveSimulado({ type: 'focus', id: item.id, title: item.title });
  };

  const handleDisciplineClick = (item: Discipline) => {
    setActiveSimulado({ 
      type: 'discipline', 
      id: item.id, 
      title: item.title,
      isFreeLimit: isFree 
    });
  };

  const handleStartCustomSimulado = (questions: any[], simuladoTitle: string) => {
    setActiveSimulado({
      type: 'custom',
      id: 'custom_generated',
      title: simuladoTitle,
      questions: questions
    });
  };

  const filteredDisciplines = disciplinesData.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f8f7f2', minHeight: '100vh', color: '#1f2937', fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%', overflowX: 'hidden', boxSizing: 'border-box', paddingBottom: '4.5rem' }}>
      
      <Header 
        userPlan={userPlan as any} 
        questionsUsed={questionsUsed} 
        onOpenPlans={() => setIsPlansOpen(true)} 
        onLogout={() => supabase.auth.signOut()} 
      />

      {isAdminUser && currentView === 'home' && !activeSimulado && (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '1rem auto 0', padding: '0 1.5rem', display: 'flex', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
          <button
            onClick={() => setCurrentView('admin')}
            style={{ backgroundColor: '#0a291c', color: '#e2c07d', border: '1px solid #e2c07d', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ⚙️ Abrir Painel de Administração
          </button>
        </div>
      )}

      {currentView === 'admin' ? (
        <AdminView onBack={() => setCurrentView('home')} />
      ) : activeSimulado ? (
        <SimuladoView 
          type={activeSimulado.type}
          itemId={activeSimulado.id} 
          itemTitle={activeSimulado.title} 
          initialQuestions={activeSimulado.questions}
          maxQuestions={activeSimulado.isFreeLimit ? 150 : undefined} 
          onBack={() => setActiveSimulado(null)} 
        />
      ) : (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem', boxSizing: 'border-box' }}>
          
          <header style={{ backgroundColor: '#0a291c', borderRadius: '16px', padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)', color: '#ffffff', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(10, 41, 28, 0.15)', border: '1px solid rgba(226, 192, 125, 0.2)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-block', border: '1px solid #e2c07d', borderRadius: '50px', padding: '0.35rem 1.2rem', fontSize: '0.75rem', fontWeight: 600, color: '#e2c07d', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              OAB • CONCURSOS • TRIBUNAIS • PÓS-GRADUAÇÃO
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 500, marginBottom: '1rem', lineHeight: '1.2', fontFamily: 'serif' }}>
              O estudo do Direito, <em style={{ color: '#e2c07d', fontStyle: 'italic' }}>refinado.</em>
            </h1>
            <p style={{ color: '#e2d9c8', fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)', maxWidth: '650px', marginBottom: '2rem', lineHeight: '1.6', opacity: 0.9 }}>
              Banco de questões comentadas, resumos estratégicos por ramo e preparação quantitativa completa para alcançar a excelência jurídica.
            </p>

            <button
              onClick={() => {
                if (isFree) {
                  alert('O Criador de Simulados Personalizados é exclusivo para assinantes Premium!');
                  setIsPlansOpen(true);
                } else {
                  setIsCustomModalOpen(true);
                }
              }}
              style={{
                backgroundColor: '#e2c07d',
                color: '#0a291c',
                border: 'none',
                padding: '0.85rem 1.8rem',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(226, 192, 125, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✨ Criar Simulado Personalizado (Até 3 Disciplinas)
            </button>
          </header>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #0a291c', borderRadius: '50px', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem', boxShadow: '0 4px 12px rgba(10, 41, 28, 0.05)', boxSizing: 'border-box' }}>
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar por assunto, artigo ou palavra-chave (ex: ECA, LRF, Arbitragem, CDC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1f2937', background: 'transparent' }}
            />
          </div>

          <h2 id="provas-foco" style={{ fontSize: '1.5rem', color: '#0a291c', marginBottom: '1.2rem', fontWeight: 700, fontFamily: 'serif' }}>
            Foco de Preparação Especial
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '3rem', width: '100%', boxSizing: 'border-box' }}>
            {specialFocusData.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleFocusClick(item)}
                style={{ 
                  backgroundColor: '#0d3524', 
                  border: '1px solid #1c523a', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  color: '#ffffff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  boxSizing: 'border-box',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(10, 41, 28, 0.25)';
                  e.currentTarget.style.borderColor = '#e2c07d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#1c523a';
                }}
              >
                <div>
                  <span style={{ backgroundColor: 'rgba(226, 192, 125, 0.2)', color: '#e2c07d', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem' }}>
                    {item.badge}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontFamily: 'serif', color: '#ffffff' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#e2d9c8', opacity: 0.8, lineHeight: '1.5' }}>
                    {item.description}
                  </p>
                </div>
                <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: '#e2c07d', fontWeight: 'bold' }}>
                  Iniciar Simulado →
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', color: '#0a291c', marginBottom: '1.2rem', fontWeight: 700, fontFamily: 'serif' }}>
            Todas as Disciplinas ({filteredDisciplines.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', width: '100%', boxSizing: 'border-box' }}>
            {filteredDisciplines.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleDisciplineClick(item)}
                style={{ 
                  backgroundColor: '#e4eae3', 
                  border: '1px solid #c7d3c5', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  color: '#1f2937', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                  boxSizing: 'border-box',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(10, 41, 28, 0.08)';
                  e.currentTarget.style.borderColor = '#0a291c';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#c7d3c5';
                  e.currentTarget.style.backgroundColor = '#e4eae3';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: '#0a291c', fontSize: '0.9rem', backgroundColor: '#d1dcce', padding: '0.15rem 0.6rem', borderRadius: '4px' }}>{item.number}</span>
                    <span style={{ backgroundColor: '#d1dcce', color: '#2d3e2d', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '50px' }}>{item.count}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a291c', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#4a5449', lineHeight: 1.5 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      <ModalPlanos 
        isOpen={isPlansOpen} 
        onClose={() => setIsPlansOpen(false)} 
      />

      <CustomSimuladoModal 
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        userId={session?.user?.id || ''}
        onStartCustomSimulado={handleStartCustomSimulado}
      />

      {/* Rodapé Flutuante Fixo (Direitos Reservados à esquerda, WhatsApp e Telegram à direita com ícones) */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#0a291c',
        color: '#e2c07d',
        borderTop: '1px solid rgba(226, 192, 125, 0.2)',
        padding: '0.75rem 2rem',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        fontSize: '0.85rem'
      }}>
        
        {/* Direitos Reservados */}
        <div style={{ color: '#e2d9c8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>© 2026</span>
          <span style={{ color: '#e2c07d', fontWeight: 'bold' }}>JURIS QUANT</span>. 
          <span style={{ opacity: 0.8, display: 'inline' }}>Todos os direitos reservados.</span>
        </div>

        {/* Ícones de Suporte (WhatsApp e Telegram) alinhados à direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* WhatsApp */}
          <a 
            href="https://wa.me/5521998190025?text=Olá,%20preciso%20de%20suporte%20no%20Juris%20Quant" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Suporte via WhatsApp"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 0110 10 10 10 0 01-14.82 8.65L2 22l1.39-5.06A10 10 0 0112 2zm0 2a8 8 0 00-6.9 12.06l-.28.98 1.02-.28A8 8 0 1012 4zm-1.12 4.07h1.03c.18 0 .34.07.45.2.2.24.78 1.88.85 2.03.07.15.11.33.02.5-.09.18-.14.28-.28.45-.14.17-.3.37-.43.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.89 1.04.93 1.92 1.22 2.2 1.36.28.14.44.12.6-.07.16-.18.7-0.81.88-1.09.18-.28.36-.23.6-.14.24.09 1.54.73 1.8 0.86.27.13.45.2.52.32.07.12.07.71-.16 1.36-.23.65-1.35 1.28-1.87 1.31-.52.03-1.02.13-3.41-.81-2.88-1.13-4.73-4.08-4.88-4.28-.14-.2-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.27-.29.58-.36.78-.36z"/>
            </svg>
          </a>

          {/* Telegram */}
          <a 
            href="https://t.me/seu_usuario_telegram" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Suporte via Telegram"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 136, 204, 0.15)',
              color: '#0088cc',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 136, 204, 0.3)',
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </a>

        </div>
      </footer>

    </div>
  );
}