import { supabase } from '../lib/supabase'

export interface Question {
  id: number
  disciplina: string
  materia: string
  banca: string
  ano: number
  enunciado: string
  opcao_a: string
  opcao_b: string
  opcao_c: string
  opcao_d: string
  resposta_correta: string
  comentario: string
  is_free?: boolean
}

export async function fetchQuestions(filtro?: string): Promise<Question[]> {
  console.log('Filtro recebido:', filtro);

  let termoBusca = filtro ? filtro.trim() : '';
  let todasQuestoes: Question[] = [];

  const tabelas = ['questoes', 'questões'];

  for (const tabela of tabelas) {
    try {
      let query = supabase.from(tabela).select('*');
      
      if (termoBusca !== '') {
        const f = termoBusca.toUpperCase();
        
        if (f.includes('OAB') || f.includes('EXAME DE ORDEM')) {
          query = query.or('disciplina.ilike.%Ética%,disciplina.ilike.%Constitucional%,disciplina.ilike.%Civil%,disciplina.ilike.%Penal%,disciplina.ilike.%Trabalhista%,disciplina.ilike.%Consumidor%,disciplina.ilike.%OAB%,materia.ilike.%Ética%,materia.ilike.%Constitucional%,materia.ilike.%Civil%,materia.ilike.%Penal%,materia.ilike.%Trabalhista%,materia.ilike.%Consumidor%,materia.ilike.%OAB%');
        } else if (f.includes('TRE') || f.includes('TSE') || f.includes('ELEITORAL')) {
          query = query.or('disciplina.ilike.%Eleitoral%,materia.ilike.%Eleitoral%');
        } else if (f.includes('TRIBUNAIS DE JUSTIÇA') || f.includes('TJ')) {
          query = query.or('disciplina.ilike.%Processo Civil%,disciplina.ilike.%Processo Penal%,disciplina.ilike.%Civil%,disciplina.ilike.%Penal%,materia.ilike.%Processo Civil%,materia.ilike.%Processo Penal%,materia.ilike.%Civil%,materia.ilike.%Penal%');
        } else if (f.includes('MINISTÉRIO PÚBLICO') || f.includes(' MP ')) {
          query = query.or('disciplina.ilike.%Penal%,disciplina.ilike.%Processo Penal%,disciplina.ilike.%ECA%,disciplina.ilike.%Criança%,materia.ilike.%Penal%,materia.ilike.%Processo Penal%,materia.ilike.%ECA%,materia.ilike.%Criança%');
        } else if (f.includes('PROCURADORIA') || f.includes('PGE') || f.includes('PGM') || f.includes('AGU')) {
          query = query.or('disciplina.ilike.%Administrativo%,disciplina.ilike.%Tributário%,disciplina.ilike.%Financeiro%,materia.ilike.%Administrativo%,materia.ilike.%Tributário%,materia.ilike.%Financeiro%');
        } else if (f.includes('FEDERAL') || f.includes('TRF')) {
          query = query.or('disciplina.ilike.%Previdenciário%,disciplina.ilike.%Constitucional%,disciplina.ilike.%Tributário%,materia.ilike.%Previdenciário%,materia.ilike.%Constitucional%,materia.ilike.%Tributário%');
        } else if (f.includes('STJ') || f.includes('STF') || f.includes('TRIBUNAIS SUPERIORES')) {
          query = query.or('disciplina.ilike.%Constitucional%,disciplina.ilike.%Jurisprudência%,disciplina.ilike.%Súmulas%,materia.ilike.%Constitucional%,materia.ilike.%Jurisprudência%,materia.ilike.%Súmulas%');
        } else if (f.includes('DEFENSORIA') || f.includes('DPE') || f.includes('DPU')) {
          query = query.or('disciplina.ilike.%Humanos%,disciplina.ilike.%Execução Penal%,disciplina.ilike.%Consumidor%,disciplina.ilike.%ECA%,materia.ilike.%Humanos%,materia.ilike.%Execução Penal%,materia.ilike.%Consumidor%,materia.ilike.%ECA%');
        } else if (f.includes('DELEGADO') || f.includes('POLICIAIS')) {
          query = query.or('disciplina.ilike.%Penal%,disciplina.ilike.%Criminologia%,disciplina.ilike.%Medicina Legal%,materia.ilike.%Penal%,materia.ilike.%Criminologia%,materia.ilike.%Medicina Legal%');
        } else if (f.includes('ECA')) {
          query = query.or('disciplina.ilike.%ECA%,disciplina.ilike.%Criança%,materia.ilike.%ECA%,materia.ilike.%Criança%');
        } else if (f.includes('MEDIAÇÃO')) {
          query = query.or('disciplina.ilike.%Mediação%,disciplina.ilike.%Arbitragem%,materia.ilike.%Mediação%,materia.ilike.%Arbitragem%');
        } else {
          query = query.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
        }
      }

      const { data, error } = await query.limit(20000);
      if (!error && data) {
        todasQuestoes.push(...(data as Question[]));
      }
    } catch (e) {
      // Ignora erros de tabela
    }
  }

  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log(`Total final de questões unicas carregadas:`, questoesUnicas.length);
  return questoesUnicas;
}