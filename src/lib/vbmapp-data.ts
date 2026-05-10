// Dados estruturais do protocolo VB-MAPP
// Baseado em: Sundberg, M. L. (2014). VB-MAPP (2ª ed.). AVB Press.
// Critérios reescritos conforme material adaptado ao português.

import { MARCOS_NIVEL2 } from "./marcos-nivel2";
import { MARCOS_NIVEL3 } from "./marcos-nivel3";

export type CodigoAplicacao = "T" | "O" | "E";
export type Area =
  | "mando"
  | "tato"
  | "ouvinte"
  | "imitacao_motora"
  | "ecoico"
  | "vps_mts"
  | "brincar_independente"
  | "comportamento_social"
  | "intraverbal"
  | "lrffc"
  | "leitura"
  | "escrita"
  | "matematica"
  | "habilidades_grupo"
  | "estrutura_linguistica";

export const AREAS: Record<Area, string> = {
  mando: "Mando",
  tato: "Tato",
  ouvinte: "Ouvinte",
  imitacao_motora: "Imitação Motora",
  ecoico: "Ecoico",
  vps_mts: "Pareamento Visual (VPS-MTS)",
  brincar_independente: "Brincar Independente",
  comportamento_social: "Comportamento Social",
  intraverbal: "Intraverbal",
  lrffc: "LRFFC",
  leitura: "Leitura",
  escrita: "Escrita",
  matematica: "Matemática",
  habilidades_grupo: "Habilidades de Grupo",
  estrutura_linguistica: "Estrutura Linguística",
};

export interface Marco {
  id: string;        // ex: "mando_1_1"
  area: Area;
  nivel: 1 | 2 | 3;
  item: number;      // posição dentro do nível (1-based)
  pontuacaoMaxima: number; // valor máximo do item (0.5 ou 1)
  codigo: CodigoAplicacao;
  descricao: string;
  criterio: string;
}

// ─────────────────────────────────────────────────────────
// NÍVEL 1 (0–18 meses)  |  5 marcos por área (10 pts por área)
// ─────────────────────────────────────────────────────────
export const MARCOS: Marco[] = [
  // ── MANDO ──
  { id: "mando_1_1", area: "mando", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Emite 2 mandos espontâneos diferentes (qualquer forma)",
    criterio: "Observar pelo menos 2 mandos espontâneos em sessão (palavras, gestos, PECS ou sinais)." },
  { id: "mando_1_2", area: "mando", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Emite 5 mandos diferentes com algum grau de espontaneidade",
    criterio: "Sem necessidade de prompting verbal completo; pode haver prompting parcial." },
  { id: "mando_1_3", area: "mando", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Emite 5 mandos espontâneos em 1 hora de observação",
    criterio: "Pelo menos 5 mandos sem prompting durante 1 hora de atividades naturais." },
  { id: "mando_1_4", area: "mando", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Emite 10 mandos espontâneos diferentes em ambientes variados",
    criterio: "Documentar 10 topografias distintas de mando em pelo menos 2 contextos." },
  { id: "mando_1_5", area: "mando", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Emite 20 mandos espontâneos diferentes, incluindo 2 de informação (\"onde?\", \"o que é?\")",
    criterio: "Repertório de pelo menos 20 topografias; 2 delas são mandos de informação." },

  // ── TATO ──
  { id: "tato_1_1", area: "tato", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Tateia 2 objetos, pessoas ou eventos",
    criterio: "Nomear espontaneamente ou mediante pergunta 'O que é isso?' pelo menos 2 itens." },
  { id: "tato_1_2", area: "tato", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Tateia 4 objetos, pessoas ou eventos",
    criterio: "Nomear pelo menos 4 itens diferentes, com ou sem pergunta do avaliador." },
  { id: "tato_1_3", area: "tato", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Tateia 8 objetos, pessoas ou eventos",
    criterio: "Nomear ao menos 8 itens; aceitam-se aproximações funcionais (ex: 'bola' por 'balão')." },
  { id: "tato_1_4", area: "tato", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Tateia 15 objetos, pessoas ou eventos",
    criterio: "Nomear pelo menos 15 itens distintos." },
  { id: "tato_1_5", area: "tato", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Tateia 20 objetos ou eventos, incluindo 2 ações",
    criterio: "Mínimo de 20 tatos; ao menos 2 devem ser verbos/ações (ex: 'correndo', 'comendo')." },

  // ── OUVINTE ──
  { id: "ouvinte_1_1", area: "ouvinte", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Responde ao próprio nome olhando para o falante",
    criterio: "Chamar o nome da criança 3 vezes; passar em 2 de 3 tentativas (virar cabeça/olhar)." },
  { id: "ouvinte_1_2", area: "ouvinte", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Segue 2 instruções simples de 1 passo (ex: 'senta', 'vem')",
    criterio: "Pelo menos 2 instruções diferentes seguidas sem gestos ou modelos físicos." },
  { id: "ouvinte_1_3", area: "ouvinte", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona 3 objetos pelo nome a partir de um conjunto de 5",
    criterio: "Com 5 objetos na mesa, identificar pelo menos 3 distintos mediante instrução verbal." },
  { id: "ouvinte_1_4", area: "ouvinte", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Segue 8 instruções de 1 passo em contexto natural",
    criterio: "8 instruções diferentes seguidas em ambientes naturais (sala, corredor, pátio)." },
  { id: "ouvinte_1_5", area: "ouvinte", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona 10 objetos ou figuras pelo nome; segue 10 instruções",
    criterio: "Identificar 10 itens e seguir 10 instruções distintas de 1 passo." },

  // ── IMITAÇÃO MOTORA ──
  { id: "imitacao_motora_1_1", area: "imitacao_motora", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Imita 2 movimentos motores grandes com objetos (ex: bater palmas com instrução)",
    criterio: "Demonstrar ação, pedir 'faça assim'; acerto em 2 de 3 tentativas por ação." },
  { id: "imitacao_motora_1_2", area: "imitacao_motora", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Imita 4 ações motoras grandes com objeto (ex: empurrar carrinho, bater no tambor)",
    criterio: "Acerto em 4 ações diferentes com objetos; sem prompting físico durante a resposta." },
  { id: "imitacao_motora_1_3", area: "imitacao_motora", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Imita 6 ações motoras grandes sem objeto",
    criterio: "Ações do próprio corpo (levantar braço, agachar); 6 ações diferentes." },
  { id: "imitacao_motora_1_4", area: "imitacao_motora", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Imita 10 ações motoras grandes, com e sem objetos",
    criterio: "10 ações distintas, variando entre uso e não uso de objetos." },
  { id: "imitacao_motora_1_5", area: "imitacao_motora", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Imita sequências de 2 ações motoras em cadeia",
    criterio: "Ex: pegar copo e tomar água; encadear 2 ações seguidas em 3 sequências diferentes." },

  // ── ECOICO ──
  { id: "ecoico_1_1", area: "ecoico", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Repete qualquer som ou sílaba após modelo do terapeuta",
    criterio: "Qualquer vocalização em resposta ao modelo; não exige acurácia fonológica." },
  { id: "ecoico_1_2", area: "ecoico", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Repete pelo menos 5 sons ou sílabas diferentes de forma consistente",
    criterio: "5 fonemas ou sílabas distintos reproduzidos com ≥80% de acerto em 5 tentativas cada." },
  { id: "ecoico_1_3", area: "ecoico", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Repete 10 palavras de 1 ou 2 sílabas",
    criterio: "Aproximação funcional aceitável (ex: 'bola' → 'boa'); 10 palavras distintas." },
  { id: "ecoico_1_4", area: "ecoico", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Repete 20 palavras diferentes com inteligibilidade de ≥50%",
    criterio: "20 palavras; compreensível por familiar em metade das ocorrências." },
  { id: "ecoico_1_5", area: "ecoico", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Repete frases de 2 palavras (5 diferentes)",
    criterio: "Reproduzir sequência de 2 palavras após modelo; 5 combinações diferentes." },

  // ── VPS-MTS (Pareamento Visual) ──
  { id: "vps_mts_1_1", area: "vps_mts", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Encaixa ou agrupa 3 objetos idênticos (emparelhamento objeto-objeto)",
    criterio: "Apresentar par idêntico e pedir para colocar igual; 3 objetos diferentes." },
  { id: "vps_mts_1_2", area: "vps_mts", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Emparelha figura à figura (3 pares diferentes)",
    criterio: "Com 3 figuras na mesa, apresentar amostra e a criança seleciona a idêntica; 3 pares." },
  { id: "vps_mts_1_3", area: "vps_mts", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Emparelha objeto à figura correspondente (5 pares)",
    criterio: "Apresentar objeto real; criança seleciona figura correspondente; 5 pares distintos." },
  { id: "vps_mts_1_4", area: "vps_mts", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Emparelha por categoria (2 categorias, 3 itens cada)",
    criterio: "Ex: animais x alimentos; agrupar corretamente em 2 categorias com 3 itens cada." },
  { id: "vps_mts_1_5", area: "vps_mts", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Emparelha por função ou característica (não apenas identidade)",
    criterio: "Ex: emparelhar 'escova de dentes' com 'pasta de dente'; 5 pares relacionais." },

  // ── BRINCAR INDEPENDENTE ──
  { id: "brincar_independente_1_1", area: "brincar_independente", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Manipula 2 brinquedos ou objetos de forma apropriada por ≥1 min sem prompting",
    criterio: "Observar em ambiente com brinquedos disponíveis; 2 itens diferentes, ≥1 min cada." },
  { id: "brincar_independente_1_2", area: "brincar_independente", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Brinca de forma funcional com 5 brinquedos diferentes",
    criterio: "Uso funcional (não apenas exploração sensorial); 5 brinquedos distintos." },
  { id: "brincar_independente_1_3", area: "brincar_independente", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Permanece engajado em brincadeira independente por ≥5 min",
    criterio: "Sem adulto direcionando; trocar de brinquedo espontaneamente é permitido." },
  { id: "brincar_independente_1_4", area: "brincar_independente", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Inicia e sustenta brincadeira de faz de conta simples",
    criterio: "Ex: dar de comer à boneca, fazer carrinho andar fazendo som de motor; ≥1 episódio." },
  { id: "brincar_independente_1_5", area: "brincar_independente", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Demonstra 5 sequências de brincadeira funcional diferentes por iniciativa própria",
    criterio: "Cada sequência = série de 3+ ações relacionadas; 5 sequências distintas observadas." },

  // ── COMPORTAMENTO SOCIAL ──
  { id: "comportamento_social_1_1", area: "comportamento_social", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Olha para o rosto do adulto em resposta a contato social",
    criterio: "Contato visual em ≥2 de 3 tentativas quando adulto inicia interação." },
  { id: "comportamento_social_1_2", area: "comportamento_social", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Sorri ou vocaliza em resposta a atenção social",
    criterio: "Resposta positiva (sorriso, vocalização) em contexto social; ≥3 ocorrências observadas." },
  { id: "comportamento_social_1_3", area: "comportamento_social", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Inicia contato social com adulto familiar (aproximação, toque, vocalização)",
    criterio: "Criança inicia o contato; não resposta a iniciativa do adulto." },
  { id: "comportamento_social_1_4", area: "comportamento_social", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Tolera a proximidade de pares sem fuga/esquiva",
    criterio: "Permanece a ≤1 metro de outra criança por ≥2 min sem demonstrar fuga." },
  { id: "comportamento_social_1_5", area: "comportamento_social", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Brinca próximo a pares (brincadeira paralela) por ≥2 min",
    criterio: "Brincadeira paralela sem interação direta; ≥2 min de proximidade funcional." },

  // ── INTRAVERBAL ──
  { id: "intraverbal_1_1", area: "intraverbal", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Completa 2 intraverbais simples (ex: 'au au faz o...')",
    criterio: "Completar frase ou música com a palavra correta; 2 diferentes." },
  { id: "intraverbal_1_2", area: "intraverbal", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Completa 5 intraverbais (frases, músicas ou rotinas verbais)",
    criterio: "5 situações distintas de completamento verbal sem pista visual." },
  { id: "intraverbal_1_3", area: "intraverbal", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Responde a 5 perguntas sociais simples (\"Como chama?\", \"Quantos anos?\")",
    criterio: "Respostas funcionais mesmo que não 100% acuradas; 5 perguntas diferentes." },
  { id: "intraverbal_1_4", area: "intraverbal", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Completa 10 intraverbais variados sem pistas visuais",
    criterio: "10 respostas intraverbais distintas em sessão de teste sem objetos ou figuras." },
  { id: "intraverbal_1_5", area: "intraverbal", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Responde a 10 perguntas sobre categorias, funções ou características (\"O que você come?\")",
    criterio: "Perguntas abertas; qualquer resposta semanticamente relacionada é aceita." },

  // ── LRFFC ──
  { id: "lrffc_1_1", area: "lrffc", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Seleciona 2 itens por função a partir de array de 5 figuras",
    criterio: "Ex: 'Mostre o que você usa para comer'; 2 itens funcionais distintos." },
  { id: "lrffc_1_2", area: "lrffc", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Seleciona 4 itens por função ou característica",
    criterio: "4 seleções corretas em array de 5; características aceitas (ex: 'qual é redondo?')." },
  { id: "lrffc_1_3", area: "lrffc", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona 8 itens diferentes por função, característica ou classe",
    criterio: "Variar entre os 3 tipos de relação (função, característica, classe)." },
  { id: "lrffc_1_4", area: "lrffc", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona 15 itens por função, característica ou classe",
    criterio: "15 seleções corretas com pelo menos 5 itens de cada tipo de relação." },
  { id: "lrffc_1_5", area: "lrffc", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona 20 itens de LRFFC com array de 10 figuras",
    criterio: "Complexidade aumentada (array maior); 20 itens corretos." },

  // ── LEITURA ──
  { id: "leitura_1_1", area: "leitura", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Emparelha palavra impressa à figura correspondente (2 palavras)",
    criterio: "Com figura e palavra impressa, associar corretamente; 2 pares distintos." },
  { id: "leitura_1_2", area: "leitura", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Emparelha 5 palavras impressas às figuras correspondentes",
    criterio: "5 pares palavra-figura; aceita-se emparelhamento sem leitura oral." },
  { id: "leitura_1_3", area: "leitura", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Seleciona figura ao ouvir palavra lida pelo terapeuta (resposta de ouvinte textual)",
    criterio: "Terapeuta lê palavra; criança seleciona figura; 8 palavras diferentes." },
  { id: "leitura_1_4", area: "leitura", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Lê (ou seleciona corretamente) 10 palavras funcionais",
    criterio: "Palavras do cotidiano (nome, banheiro, saída); selecionar ou ler 10." },
  { id: "leitura_1_5", area: "leitura", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Segue instruções escritas simples (1 passo) — resposta de ouvinte textual",
    criterio: "Ex: cartão 'sente'; criança executa ação mediante instrução escrita; 5 instruções." },

  // ── ESCRITA ──
  { id: "escrita_1_1", area: "escrita", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Segura lápis ou caneta de forma funcional por ≥30 segundos",
    criterio: "Preensão trípoide ou qualquer preensão funcional; mantém por 30s sem largar." },
  { id: "escrita_1_2", area: "escrita", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Rabisca ou faz marcas no papel sob instrução",
    criterio: "Marcas intencionais (não acidentais); em resposta a 'desenha' ou 'escreve'." },
  { id: "escrita_1_3", area: "escrita", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Copia formas geométricas simples (linha vertical, horizontal, círculo)",
    criterio: "Cópia reconhecível de 3 formas; avaliador demonstra e pede 'faz igual'." },
  { id: "escrita_1_4", area: "escrita", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Copia o próprio nome (pelo menos as 2 primeiras letras legíveis)",
    criterio: "Cópia com modelo visual presente; ≥2 letras reconhecíveis do nome." },
  { id: "escrita_1_5", area: "escrita", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Escreve o próprio nome sem modelo",
    criterio: "Sem cópia; escrever nome completo ou pelo menos 3 letras legíveis sem modelo." },

  // ── MATEMÁTICA ──
  { id: "matematica_1_1", area: "matematica", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Emparelha quantidade (1 e 2) a numeral",
    criterio: "Com objetos e numerais impressos, emparelhar 1 e 2 objetos ao algarismo correto." },
  { id: "matematica_1_2", area: "matematica", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "T",
    descricao: "Conta sequência de 1 a 3 com correspondência um a um",
    criterio: "Contar objetos apontando; um numeral por objeto; até 3 sem erros." },
  { id: "matematica_1_3", area: "matematica", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Identifica numerais de 1 a 5 receptivamente",
    criterio: "Terapeuta nomeia; criança seleciona numeral correto; array de 5 numerais." },
  { id: "matematica_1_4", area: "matematica", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Conta até 10 com correspondência um a um",
    criterio: "Contar 10 objetos físicos sem pular ou repetir; todas as 10 correspondências corretas." },
  { id: "matematica_1_5", area: "matematica", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "T",
    descricao: "Nomeia numerais de 1 a 5 (resposta de falante)",
    criterio: "Terapeuta aponta numeral; criança nomeia; 5 numerais diferentes." },

  // ── HABILIDADES DE GRUPO ──
  { id: "habilidades_grupo_1_1", area: "habilidades_grupo", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Senta em grupo por ≥1 min sem comportamentos disruptivos",
    criterio: "Roda, tapete ou mesa; permanecer sentado sem agredir, fugir ou gritar por 1 min." },
  { id: "habilidades_grupo_1_2", area: "habilidades_grupo", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Segue 2 instruções dadas ao grupo (não individualmente)",
    criterio: "Instrução coletiva (ex: 'todos de pé'); criança responde junto com o grupo." },
  { id: "habilidades_grupo_1_3", area: "habilidades_grupo", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Permanece em atividade de grupo por ≥5 min",
    criterio: "Participação mínima (não precisa ser ativa); sem comportamentos de fuga por 5 min." },
  { id: "habilidades_grupo_1_4", area: "habilidades_grupo", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Participa de rotinas de grupo (música, roda, hora do lanche) de forma funcional",
    criterio: "Engajamento observável em pelo menos 2 rotinas diferentes de grupo." },
  { id: "habilidades_grupo_1_5", area: "habilidades_grupo", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Responde corretamente quando chamado individualmente durante atividade de grupo",
    criterio: "Terapeuta chama nome em grupo; criança responde (olha, vocaliza, executa); ≥2 tentativas." },

  // ── ESTRUTURA LINGUÍSTICA ──
  { id: "estrutura_linguistica_1_1", area: "estrutura_linguistica", nivel: 1, item: 1, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Usa combinação de 2 palavras espontaneamente (qualquer função)",
    criterio: "Qualquer combinação espontânea de 2 morfemas; observada em contexto natural." },
  { id: "estrutura_linguistica_1_2", area: "estrutura_linguistica", nivel: 1, item: 2, pontuacaoMaxima: 0.5, codigo: "O",
    descricao: "Usa 5 combinações de 2 palavras diferentes",
    criterio: "5 pares distintos observados; não precisa ser na mesma sessão." },
  { id: "estrutura_linguistica_1_3", area: "estrutura_linguistica", nivel: 1, item: 3, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Usa artigos ou pronomes simples ('o', 'a', 'meu', 'minha') em 5 situações",
    criterio: "Uso funcional e espontâneo; 5 ocorrências observadas." },
  { id: "estrutura_linguistica_1_4", area: "estrutura_linguistica", nivel: 1, item: 4, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Usa frases de 3 palavras com sujeito + verbo + objeto",
    criterio: "Ex: 'quero suco mais'; 5 frases distintas observadas espontaneamente." },
  { id: "estrutura_linguistica_1_5", area: "estrutura_linguistica", nivel: 1, item: 5, pontuacaoMaxima: 1, codigo: "O",
    descricao: "Usa plural, passado ou outras flexões morfológicas em 5 situações",
    criterio: "Uso espontâneo de pelo menos 1 flexão morfológica em 5 ocorrências." },
  ...MARCOS_NIVEL2,
  ...MARCOS_NIVEL3,
];

// ─────────────────────────────────────────────────────────
// BARREIRAS DE APRENDIZAGEM (24)  |  Escala 0–4
// ─────────────────────────────────────────────────────────
export interface Barreira {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
}

export const BARREIRAS: Barreira[] = [
  { id: "barreira_1", numero: 1, nome: "Reforçadores insuficientes",
    descricao: "Poucos itens ou atividades funcionam como reforçadores; dificulta ensino." },
  { id: "barreira_2", numero: 2, nome: "Controle por reforçador",
    descricao: "Dificuldade de transferir controle do reforçador para outros estímulos." },
  { id: "barreira_3", numero: 3, nome: "Ausência de imitação",
    descricao: "Não imita modelos do terapeuta ou pares; prejudica aprendizagem observacional." },
  { id: "barreira_4", numero: 4, nome: "Déficit de instrução formal",
    descricao: "Não segue instruções mesmo com reforçamento; requer ensino de obedecer." },
  { id: "barreira_5", numero: 5, nome: "Prompting-dependente",
    descricao: "Depende de prompts físicos ou verbais para emitir respostas corretas." },
  { id: "barreira_6", numero: 6, nome: "Déficit em transferência de estímulo",
    descricao: "Dificuldade em generalizar respostas aprendidas para novos contextos." },
  { id: "barreira_7", numero: 7, nome: "Déficit em atenção ao estímulo",
    descricao: "Não olha para estímulos relevantes; responde a aspectos não críticos." },
  { id: "barreira_8", numero: 8, nome: "Déficit em controle por instrução",
    descricao: "Instrução verbal tem pouco controle sobre o comportamento." },
  { id: "barreira_9", numero: 9, nome: "Comportamentos problemáticos",
    descricao: "Frequência ou intensidade de comportamentos-problema interfere no ensino." },
  { id: "barreira_10", numero: 10, nome: "Déficit de atenção/hiperatividade",
    descricao: "Dificuldade de manter atenção sustentada ou de inibir respostas impulsivas." },
  { id: "barreira_11", numero: 11, nome: "Déficit de compliance",
    descricao: "Recusa frequente em seguir instruções ou participar de atividades estruturadas." },
  { id: "barreira_12", numero: 12, nome: "Déficit em habilidades de estudo",
    descricao: "Não se adapta ao formato de ensino (mesa, materiais, rotina de tentativas)." },
  { id: "barreira_13", numero: 13, nome: "Déficit de discriminação",
    descricao: "Dificuldade de discriminar entre estímulos semelhantes (confunde letras, figuras)." },
  { id: "barreira_14", numero: 14, nome: "Hiperseletividade",
    descricao: "Responde a apenas um aspecto de estímulos compostos; ignora outros." },
  { id: "barreira_15", numero: 15, nome: "Déficit em respostas de ouvinte",
    descricao: "Pouco controle por estímulo verbal; não responde a instrução ou nome." },
  { id: "barreira_16", numero: 16, nome: "Déficit em comportamento verbal (falante)",
    descricao: "Repertório vocal restrito; limita aquisição de operantes verbais." },
  { id: "barreira_17", numero: 17, nome: "Déficit em intraverbal",
    descricao: "Dificuldade de responder a perguntas abertas ou completar frases." },
  { id: "barreira_18", numero: 18, nome: "Déficit de brincar",
    descricao: "Brincar restrito a exploração sensorial; ausência de brincar simbólico ou funcional." },
  { id: "barreira_19", numero: 19, nome: "Déficit em comportamento social",
    descricao: "Pouco interesse ou habilidade para interagir com pares." },
  { id: "barreira_20", numero: 20, nome: "Déficit em habilidades de grupo",
    descricao: "Dificuldade de participar de atividades com mais de uma pessoa." },
  { id: "barreira_21", numero: 21, nome: "Déficit em habilidades de transição",
    descricao: "Resistência a mudanças de atividade, ambiente ou rotina." },
  { id: "barreira_22", numero: 22, nome: "Déficits em autocuidado",
    descricao: "Dependência em atividades de vida diária (alimentação, higiene, vestuário)." },
  { id: "barreira_23", numero: 23, nome: "Déficit em habilidades motoras",
    descricao: "Limitações motoras finas ou grossas que interferem no desempenho em tarefas." },
  { id: "barreira_24", numero: 24, nome: "Déficit em generalização",
    descricao: "Habilidades aprendidas não se generalizam para novos estímulos, locais ou pessoas." },
];

// ─────────────────────────────────────────────────────────
// ÁREAS DE TRANSIÇÃO (18)  |  Escala 0–5
// ─────────────────────────────────────────────────────────
export interface AreaTransicao {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
}

export const AREAS_TRANSICAO: AreaTransicao[] = [
  { id: "transicao_1", numero: 1, nome: "Repertório de linguagem",
    descricao: "Nível de desenvolvimento de linguagem receptiva e expressiva." },
  { id: "transicao_2", numero: 2, nome: "Comportamento não-verbal",
    descricao: "Habilidades de comunicação não-verbal (gestos, expressão facial, contato visual)." },
  { id: "transicao_3", numero: 3, nome: "Habilidades sociais com pares",
    descricao: "Capacidade de iniciar e manter interações com outras crianças." },
  { id: "transicao_4", numero: 4, nome: "Comportamentos problemáticos",
    descricao: "Frequência e intensidade de comportamentos que interferem na inclusão." },
  { id: "transicao_5", numero: 5, nome: "Controle comportamental",
    descricao: "Capacidade de seguir regras e expectativas do ambiente escolar." },
  { id: "transicao_6", numero: 6, nome: "Adaptação a ambientes escolares",
    descricao: "Tolerância a barulho, transições, materiais e rotinas escolares." },
  { id: "transicao_7", numero: 7, nome: "Habilidades acadêmicas",
    descricao: "Nível de pré-requisitos acadêmicos (leitura, escrita, matemática básica)." },
  { id: "transicao_8", numero: 8, nome: "Autocuidado",
    descricao: "Independência em higiene, alimentação e vestimenta." },
  { id: "transicao_9", numero: 9, nome: "Motricidade grossa e fina",
    descricao: "Habilidades motoras necessárias para o ambiente escolar." },
  { id: "transicao_10", numero: 10, nome: "Ritmo de aprendizagem",
    descricao: "Velocidade e eficiência na aquisição de novas habilidades." },
  { id: "transicao_11", numero: 11, nome: "Generalização de habilidades",
    descricao: "Capacidade de usar habilidades aprendidas em novos contextos." },
  { id: "transicao_12", numero: 12, nome: "Comportamento em grupo",
    descricao: "Participação funcional em atividades de grupo." },
  { id: "transicao_13", numero: 13, nome: "Independência na tarefa",
    descricao: "Capacidade de trabalhar sem supervisão constante." },
  { id: "transicao_14", numero: 14, nome: "Atenção sustentada",
    descricao: "Capacidade de manter foco em atividades por período adequado à idade." },
  { id: "transicao_15", numero: 15, nome: "Generalização para múltiplos adultos",
    descricao: "Responder funcional e adequadamente a diferentes adultos (professores, aides)." },
  { id: "transicao_16", numero: 16, nome: "Resposta a reforço natural",
    descricao: "Aprender com as contingências naturais do ambiente sem sistema de reforço artificial." },
  { id: "transicao_17", numero: 17, nome: "Habilidades de brincar",
    descricao: "Repertório de brincar funcional e simbólico adequado para o ambiente escolar." },
  { id: "transicao_18", numero: 18, nome: "Necessidade de apoio",
    descricao: "Quantidade de suporte adicional (1:1, adaptações, recursos) requerido." },
];

// ─────────────────────────────────────────────────────────
// Funções utilitárias
// ─────────────────────────────────────────────────────────
export function getPontuacaoMaximaPorArea(area: Area, nivel: 1 | 2 | 3): number {
  return MARCOS
    .filter((m) => m.area === area && m.nivel === nivel)
    .reduce((acc, m) => acc + m.pontuacaoMaxima, 0);
}

export function getPontuacaoMaximaTotal(): number {
  return MARCOS.reduce((acc, m) => acc + m.pontuacaoMaxima, 0);
}

export function getMarcosPorArea(area: Area): Marco[] {
  return MARCOS.filter((m) => m.area === area).sort((a, b) => a.nivel - b.nivel || a.item - b.item);
}

export function getMarcosPorNivel(nivel: 1 | 2 | 3): Marco[] {
  return MARCOS.filter((m) => m.nivel === nivel);
}
