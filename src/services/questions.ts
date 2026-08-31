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

  // Consultas limpas focando estritamente no termo exato enviado, sem misturar matérias
  let q1 = supabase.from('questões').select('*');
  let q2 = supabase.from('questoes').select('*');

  if (termoBusca !== '') {
    q1 = q1.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
    q2 = q2.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
  }

  const [res1, res2] = await Promise.all([
    q1.limit(20000),
    q2.limit(20000)
  ]);

  let todasQuestoes: Question[] = [];
  if (res1.data) todasQuestoes.push(...(res1.data as Question[]));
  if (res2.data) todasQuestoes.push(...(res2.data as Question[]));

  // Remove questões duplicadas baseando-se no enunciado
  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log(`Total final de questões unicas carregadas:`, questoesUnicas.length);
  return questoesUnicas;
}