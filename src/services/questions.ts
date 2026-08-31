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

  // Tenta buscar na tabela 'questoes' (sem acento)
  try {
    let q1 = supabase.from('questoes').select('*');
    if (termoBusca !== '') {
      q1 = q1.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
    }
    const { data: res1, error: err1 } = await q1.limit(20000);
    if (!err1 && res1) {
      todasQuestoes.push(...(res1 as Question[]));
    }
  } catch (e) {
    // Ignora se a tabela não existir ou falhar por permissão
  }

  // Tenta buscar na tabela 'questões' (com acento)
  try {
    let q2 = supabase.from('questões').select('*');
    if (termoBusca !== '') {
      q2 = q2.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
    }
    const { data: res2, error: err2 } = await q2.limit(20000);
    if (!err2 && res2) {
      todasQuestoes.push(...(res2 as Question[]));
    }
  } catch (e) {
    // Ignora se a tabela não existir ou falhar por permissão
  }

  // Remove questões duplicadas baseando-se no enunciado unificado
  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log(`Total final de questões unicas carregadas:`, questoesUnicas.length);
  return questoesUnicas;
}