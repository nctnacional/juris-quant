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

  let termosBusca: string[] = [];

  if (filtro && filtro.trim() !== '') {
    const f = filtro.toUpperCase();
    
    // Focos de Preparação Especial
    if (f.includes('OAB') || f.includes('EXAME DE ORDEM')) {
      termosBusca = ['Ética', 'Constitucional', 'Civil', 'Penal', 'Trabalhista', 'Consumidor', 'OAB', 'Exame de Ordem'];
    } else if (f.includes('TRE') || f.includes('TSE') || f.includes('ELEITORAL')) {
      termosBusca = ['Eleitoral', 'Direito Eleitoral', 'Constitucional', 'Administrativo'];
    } else if (f.includes('TRIBUNAIS DE JUSTIÇA') || f.includes('TJ')) {
      termosBusca = ['Processo Civil', 'Processo Penal', 'Organização Judiciária', 'Civil', 'Penal'];
    } else if (f.includes('MINISTÉRIO PÚBLICO') || f.includes(' MP ')) {
      termosBusca = ['Penal', 'Processo Penal', 'ECA', 'Criança', 'Difusos', 'Coletivos'];
    } else if (f.includes('PROCURADORIA') || f.includes('PGE') || f.includes('PGM') || f.includes('AGU')) {
      termosBusca = ['Administrativo', 'Tributário', 'Financeiro', 'Processo Civil', 'Constitucional'];
    } else if (f.includes('FEDERAL') || f.includes('TRF')) {
      termosBusca = ['Previdenciário', 'Constitucional', 'Tributário'];
    } else if (f.includes('STJ') || f.includes('STF') || f.includes('TRIBUNAIS SUPERIORES')) {
      termosBusca = ['Constitucional', 'Jurisprudência', 'Súmulas', 'Controle'];
    } else if (f.includes('DEFENSORIA') || f.includes('DPE') || f.includes('DPU')) {
      termosBusca = ['Humanos', 'Execução Penal', 'Consumidor', 'ECA', 'Criança', 'Tutela Coletiva'];
    } else if (f.includes('DELEGADO') || f.includes('POLICIAIS')) {
      termosBusca = ['Penal', 'Criminologia', 'Medicina Legal', 'Leis Penais', 'Processo Penal'];
    } else {
      // Disciplinas Individuais: busca pelo termo exato e também por palavras-chave parciais se necessário
      termosBusca = [filtro.trim()];
      if (f.includes('ECA')) {
        termosBusca.push('Criança e do Adolescente', 'ECA');
      } else if (f.includes('MEDIAÇÃO')) {
        termosBusca.push('Mediação, Conciliação e Arbitragem', 'Arbitragem');
      }
    }
  } else {
    termosBusca = [''];
  }

  let todasQuestoes: Question[] = [];
  const termosUnicos = Array.from(new Set(termosBusca));

  // Executa a busca nas duas tabelas do Supabase
  for (const termo of termosUnicos) {
    const tabelas = ['questoes', 'questões'];
    
    for (const tabela of tabelas) {
      try {
        let query = supabase.from(tabela).select('*');
        if (termo !== '') {
          query = query.or(`disciplina.ilike.%${termo}%,materia.ilike.%${termo}%,banca.ilike.%${termo}%`);
        }
        const { data, error } = await query.limit(20000);
        if (!error && data) {
          todasQuestoes.push(...(data as Question[]));
        }
      } catch (e) {
        // Ignora erros de tabelas inexistentes
      }
    }
  }

  // Remove questões duplicadas pelo enunciado
  const questoesUnicas = Array.from(
    new Map(todasQuestoes.map(q => [q.enunciado, q])).values()
  );

  console.log(`Total final de questões unicas carregadas:`, questoesUnicas.length);
  return questoesUnicas;
}