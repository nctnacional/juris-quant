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
  console.log('Buscando questões , questoes estritas para o filtro:', filtro);

  let query = supabase.from('questões questoes').select('*');

  if (filtro && filtro.trim() !== '') {
    let termoBusca = filtro.trim();
    const upperFiltro = termoBusca.toUpperCase();

    // Mapeamento específico para cada Concurso / Carreira do seu menu
    if (upperFiltro.includes('TRE') || upperFiltro.includes('TSE')) {
      termoBusca = 'Eleitoral'; // Ajuste aqui se sua disciplina se chamar diferente, ex: 'Direito Eleitoral'
    } else if (upperFiltro.includes('OAB')) {
      termoBusca = 'Ética';
    } else if (upperFiltro.includes('TJ') || upperFiltro.includes('TRIBUNAIS DE JUSTIÇA')) {
      termoBusca = 'Processo';
    } else if (upperFiltro.includes('MP') || upperFiltro.includes('MINISTÉRIO PÚBLICO')) {
      termoBusca = 'Penal';
    } else if (upperFiltro.includes('PROCURADORIA') || upperFiltro.includes('AGU')) {
      termoBusca = 'Tributário';
    } else if (upperFiltro.includes('FEDERAL') || upperFiltro.includes('TRF')) {
      termoBusca = 'Previdenciário';
    } else if (upperFiltro.includes('SUPERIORES') || upperFiltro.includes('STJ')) {
      termoBusca = 'Constitucional';
    } else if (upperFiltro.includes('DEFENSORIA')) {
      termoBusca = 'Humanos';
    } else if (upperFiltro.includes('POLICIAIS') || upperFiltro.includes('DELEGADO')) {
      termoBusca = 'Penal';
    }

    // Busca exata e restrita nas colunas disciplina ou materia
    query = query.or(`disciplina.ilike.%${termoBusca}%,materia.ilike.%${termoBusca}%`);
  }

  const { data, error } = await query.limit(2000);

  if (error) {
    console.error('ERRO DO SUPABASE:', error.message, error.details, error.hint);
    return [];
  }

  // Se realmente não houver questões para esse filtro específico, retorna vazio
  // para você saber que precisa cadastrar questões para essa matéria/concurso no Supabase.
  if (!data || data.length === 0) {
    console.warn('Nenhuma questão encontrada especificamente para:', filtro);
    return [];
  }

  console.log('Questões Questoes específicas encontradas:', data.length);
  return data as Question[];
}