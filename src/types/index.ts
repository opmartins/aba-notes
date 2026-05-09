export interface Paciente {
  id: number;
  nome: string;
  dataNascimento: string;
  diagnostico: string | null;
  responsavel: string | null;
  telefoneResponsavel: string | null;
  dataInicio: string | null;
  observacoes: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Avaliacao {
  id: number;
  pacienteId: number;
  numero: number;
  dataAvaliacao: string;
  idadeEmMeses: number | null;
  terapeuta: string | null;
  status: "em_andamento" | "concluida";
  observacoesGerais: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
