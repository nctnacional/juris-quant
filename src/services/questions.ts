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

  // Se vier um filtro de card (ex: "Concurso TRE / TSE"), mapeamos para o termo real da disciplina
  let termosBusca: string[] = [];

  if (filtro && filtro.trim() !== '') {
    const f = filtro.toUpperCase();
    
    if (f.includes('TRE') || f.includes('TSE') || f.includes('ELEITORAL')) {
      termosBusca = ['Eleitoral', 'Direito Eleitoral'];
    } else if (f.includes('OAB') || f.includes('ÉTICA')) {
      termosBusca = ['Ética', 'Exame de Ordem'];
    } else if (f.includes('TRIBUNAL') || f.includes('JUSTIÇA') || f.includes('TJ')) {
      termosBusca = ['Processo', 'Civil', 'Judiciária', 'Direito'];
    } else if (f.includes('MINISTÉRIO PÚBLICO') || f.includes('MP')) {
      termosBusca = ['Penal', 'Processo Penal', 'Difusos', 'Coletivos', 'ECA'];
    } else if (f.includes('PROCURADORIA') || f.includes('PGE') || f.includes('AGU')) {
      termosBusca = ['Tributário', 'Administrativo', 'Financeiro'];
    } else if (f.includes('FEDERAL') || f.includes('TRF')) {
      termosBusca = ['Previdenciário', 'Constitucional', 'Tributário'];
    } else if (f.includes('SUPERIORES') || f.includes('STJ') || f.includes('STF')) {
      termosBusca = ['Constitucional', 'Jurisprudência', 'Súmulas'];
    } else if (f.includes('DEFENSORIA') || f.includes('DPE')) {
      termosBusca = ['Humanos', 'Execução Penal', 'Consumidor', 'ECA'];
    } else if (f.includes('POLICIAIS') || f.includes('DELEGADO')) {
      termosBusca = ['Penal', 'Criminologia', 'Medicina Legal', 'Leis Penais'];
    } else {
      // Se não cair em nenhum card específico, busca o próprio texto digitado
      termosBusca = [filtro.trim()];
    }
  } else {
    // Se nenhum filtro for passado, traz tudo (limitado)
    termosBusca = [''];
  }

  let todasQuestoes: Question[] = [];

  // Busca para cada termo mapeado nas duas tabelas
  for (const termo of termosBusca) {
    // Consulta 1: Tabela 'questões'
    let q1 = supabase.from('questões').select('*');
    if (termo !== '') {
      q1 = q1.or(`disciplina.ilike.%${termo}%,materia.ilike.%${termo}%`);
    }

    // Consulta 2: Tabela 'questoes'
    let q2 = supabase.from('questoes').select('*');
    if (termo !== '') {
      q2 = q2.or(`disciplina.ilike.%${termo}%,materia.ilike.%${termo}%`);
    }

    const [res1, res2] = await Promise.all([
      q1.limit(200),
      q2.limit(200)
    ]);

    if (res1.data) todasQuestoes.push(...(res1.data as Question[]));
    if (res2.data) todasQuestoes.push(...(res2.data as Question[]));
  }

  // Se mesmo assim não encontrar nada com os termos mapeados, faz uma busca coringa global pelo filtro original
  if (todasQuestoes.length === 0 && filtro && filtro.trim() !== '') {
    const tGeral = filtro.trim();
    const [resG1, resG2] = await Promise.all([
      supabase.from('questões').select('*').or(`disciplina.ilike.%${tGeral}%,materia.ilike.%${tGeral}%,enunciado.ilike.%${tGeral}%`).limit(200),
      supabase.from('questoes').select('*').or(`disciplina.ilike.%${tGeral}%,materia.ilike.%${tGeral}%,enunciado.ilike.%${tGeral}%`).limit(200)
    ]);
    if (resG1.data) todasQuestoes.push(...(resG1.data as Question[]));
    if (resG2.data) todasQuestoes.push(...(resG2.data as Question[]));
  }

  // Remove duplicadas com base no enunciado
  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log(`Total final de questões unicas carregadas:`, questoesUnicas.length);
  return questoesUnicas;
}