import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import SimuladoView from './components/SimuladoView';
import Header from './components/Header';

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
  const [userPlan, setUserPlan] = useState<string>('free'); // Padrão inicial free
  const [activeSimulado, setActiveSimulado] = useState<{
    type: 'discipline' | 'focus';
    id: string;
    title: string;
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

  // Busca o plano na tabela 'profiles' e o progresso na tabela 'progresso do usuário'
  const fetchUserData = async (userId: string) => {
    try {
      // 1. Busca o plano na tabela profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();

      if (profileData && profileData.plan) {
        setUserPlan(profileData.plan); // 'free', 'intermediario' ou 'premium'
      }

      // 2. Busca o progresso de questões
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
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#0a291c', fontFamily: 'sans-serif' }}>
        <h2>Carregando...</h2>
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
    // Se for Plano Intermediário, restringe focos especiais exceto OAB e TRE
    if (isIntermediario && item.id !== 'oab' && item.id !== 'tre') {
      alert('Seu plano atual ("Plano Disciplinas") dá acesso às disciplinas, OAB e TRE. Faça o upgrade para o Plano Completo para desbloquear as demais preparações especiais!');
      return;
    }

    // Se for Plano Gratuito, bloqueia todas as áreas de foco especial
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
      isFreeLimit: isFree // Aplica o limite de questões apenas se for Free
    });
  };

  const filteredDisciplines = disciplinesData.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f8f7f2', minHeight: '100vh', color: '#1f2937', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <Header 
        userPlan={userPlan as any} 
        questionsUsed={questionsUsed} 
        onOpenPlans={() => alert('Funcionalidade de upgrade em breve!')} 
        onLogout={() => supabase.auth.signOut()} 
      />

      {activeSimulado ? (
        <SimuladoView 
          type={activeSimulado.type}
          itemId={activeSimulado.id} 
          itemTitle={activeSimulado.title} 
          maxQuestions={activeSimulado.isFreeLimit ? 150 : undefined} 
          onBack={() => setActiveSimulado(null)} 
        />
      ) : (
        <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
          
          <header style={{ backgroundColor: '#0a291c', borderRadius: '16px', padding: '3rem 2rem', color: '#ffffff', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(10, 41, 28, 0.15)', border: '1px solid rgba(226, 192, 125, 0.2)' }}>
            <span style={{ display: 'inline-block', border: '1px solid #e2c07d', borderRadius: '50px', padding: '0.35rem 1.2rem', fontSize: '0.75rem', fontWeight: 600, color: '#e2c07d', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              OAB • CONCURSOS • TRIBUNAIS • PÓS-GRADUAÇÃO
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 500, marginBottom: '1rem', lineHeight: '1.2', fontFamily: 'serif' }}>
              O estudo do Direito, <em style={{ color: '#e2c07d', fontStyle: 'italic' }}>refinado.</em>
            </h1>
            <p style={{ color: '#e2d9c8', fontSize: '1rem', maxWidth: '650px', marginBottom: '2rem', lineHeight: '1.6', opacity: 0.9 }}>
              Banco de questões comentadas, resumos estratégicos por ramo e preparação quantitativa completa para alcançar a excelência jurídica.
            </p>
          </header>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #0a291c', borderRadius: '50px', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem', boxShadow: '0 4px 12px rgba(10, 41, 28, 0.05)' }}>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '3rem' }}>
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease'
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
    </div>
  );
}