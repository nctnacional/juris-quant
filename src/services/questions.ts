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
  console.log('Buscando questões para o filtro:', filtro);

  const termoBusca = filtro ? filtro.trim() : '';

  // 1. Cria a consulta para a tabela 'questões'
  let query1 = supabase.from('questões').select('*');
  if (termoBusca !== '') {
    query1 = query1.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%,enunciado.ilike.%${termoBusca}%`);
  }

  // 2. Cria a consulta para a tabela 'questoes' (sem acento)
  let query2 = supabase.from('questoes').select('*');
  if (termoBusca !== '') {
    query2 = query2.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%,enunciado.ilike.%${termoBusca}%`);
  }

  // Executa as duas buscas ao mesmo tempo no Supabase
  const [res1, res2] = await Promise.all([
    query1.limit(500),
    query2.limit(500)
  ]);

  if (res1.error) console.error('Erro na tabela questões:', res1.error.message);
  if (res2.error) console.error('Erro na tabela questoes:', res2.error.message);

  // Junta os resultados das duas tabelas
  const dados1 = (res1.data || []) as Question[];
  const dados2 = (res2.data || []) as Question[];
  const todasQuestoes = [...dados1, ...dados2];

  // Remove eventuais questões duplicadas pelo ID ou enunciado (caso existam nas duas)
  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log('Total de questões encontradas (unindo as duas tabelas):', questoesUnicas.length);
  return questoesUnicas;
}