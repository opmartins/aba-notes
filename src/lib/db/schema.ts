import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────
// Pacientes
// ─────────────────────────────────────────────
export const pacientes = pgTable("pacientes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  dataNascimento: text("data_nascimento").notNull(),
  diagnostico: text("diagnostico"),
  responsavel: text("responsavel"),
  telefoneResponsavel: text("telefone_responsavel"),
  dataInicio: text("data_inicio"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: text("criado_em").notNull().default(sql`now()`),
  atualizadoEm: text("atualizado_em").notNull().default(sql`now()`),
});

// ─────────────────────────────────────────────
// Avaliações (múltiplas por paciente)
// ─────────────────────────────────────────────
export const avaliacoes = pgTable("avaliacoes", {
  id: serial("id").primaryKey(),
  pacienteId: integer("paciente_id")
    .notNull()
    .references(() => pacientes.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  dataAvaliacao: text("data_avaliacao").notNull(),
  idadeEmMeses: integer("idade_em_meses"),
  terapeuta: text("terapeuta"),
  status: text("status").notNull().default("em_andamento"),
  observacoesGerais: text("observacoes_gerais"),
  criadoEm: text("criado_em").notNull().default(sql`now()`),
  atualizadoEm: text("atualizado_em").notNull().default(sql`now()`),
});

// ─────────────────────────────────────────────
// Respostas dos marcos (170 itens)
// Pontuação: 0, 0.5, 1
// ─────────────────────────────────────────────
export const respostasMarcos = pgTable("respostas_marcos", {
  id: serial("id").primaryKey(),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  marcoId: text("marco_id").notNull(),
  area: text("area").notNull(),
  nivel: integer("nivel").notNull(),
  item: integer("item").notNull(),
  pontuacao: real("pontuacao"),
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`now()`),
});

// ─────────────────────────────────────────────
// Respostas das barreiras de aprendizagem (24)
// Pontuação: 0–4
// ─────────────────────────────────────────────
export const respostasBarreiras = pgTable("respostas_barreiras", {
  id: serial("id").primaryKey(),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  barreiraId: text("barreira_id").notNull(),
  numero: integer("numero").notNull(),
  pontuacao: integer("pontuacao"),
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`now()`),
});

// ─────────────────────────────────────────────
// Respostas de transição (18 áreas)
// Pontuação: 0–5
// ─────────────────────────────────────────────
export const respostasTransicao = pgTable("respostas_transicao", {
  id: serial("id").primaryKey(),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  transicaoId: text("transicao_id").notNull(),
  numero: integer("numero").notNull(),
  pontuacao: integer("pontuacao"),
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`now()`),
});

// ─────────────────────────────────────────────
// Tipos exportados para uso no app
// ─────────────────────────────────────────────
export type Paciente = typeof pacientes.$inferSelect;
export type NovoPaciente = typeof pacientes.$inferInsert;
export type Avaliacao = typeof avaliacoes.$inferSelect;
export type NovaAvaliacao = typeof avaliacoes.$inferInsert;
export type RespostaMarco = typeof respostasMarcos.$inferSelect;
export type RespostaBarreira = typeof respostasBarreiras.$inferSelect;
export type RespostaTransicao = typeof respostasTransicao.$inferSelect;
