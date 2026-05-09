import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─────────────────────────────────────────────
// Pacientes
// ─────────────────────────────────────────────
export const pacientes = sqliteTable("pacientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  dataNascimento: text("data_nascimento").notNull(),
  diagnostico: text("diagnostico"),
  responsavel: text("responsavel"),
  telefoneResponsavel: text("telefone_responsavel"),
  dataInicio: text("data_inicio"),
  observacoes: text("observacoes"),
  ativo: integer("ativo", { mode: "boolean" }).notNull().default(true),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
  atualizadoEm: text("atualizado_em").notNull().default(sql`(datetime('now'))`),
});

// ─────────────────────────────────────────────
// Avaliações (múltiplas por paciente)
// ─────────────────────────────────────────────
export const avaliacoes = sqliteTable("avaliacoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pacienteId: integer("paciente_id")
    .notNull()
    .references(() => pacientes.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(), // 1ª, 2ª, 3ª, 4ª avaliação
  dataAvaliacao: text("data_avaliacao").notNull(),
  idadeEmMeses: integer("idade_em_meses"),
  terapeuta: text("terapeuta"),
  status: text("status").notNull().default("em_andamento"), // em_andamento | concluida
  observacoesGerais: text("observacoes_gerais"),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
  atualizadoEm: text("atualizado_em").notNull().default(sql`(datetime('now'))`),
});

// ─────────────────────────────────────────────
// Respostas dos marcos (170 itens)
// Pontuação: 0, 0.5, 1
// ─────────────────────────────────────────────
export const respostasMarcos = sqliteTable("respostas_marcos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  // Identifica o marco (ex: "mando_1_1" = área mando, nível 1, item 1)
  marcoId: text("marco_id").notNull(),
  area: text("area").notNull(),
  nivel: integer("nivel").notNull(), // 1, 2 ou 3
  item: integer("item").notNull(),
  // 0, 0.5 ou 1 (null = não avaliado)
  pontuacao: real("pontuacao"),
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
});

// ─────────────────────────────────────────────
// Respostas das barreiras de aprendizagem (24)
// Pontuação: 0–4
// ─────────────────────────────────────────────
export const respostasBarreiras = sqliteTable("respostas_barreiras", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  barreiraId: text("barreira_id").notNull(),
  numero: integer("numero").notNull(), // 1–24
  pontuacao: integer("pontuacao"), // 0–4
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
});

// ─────────────────────────────────────────────
// Respostas de transição (18 áreas)
// Pontuação: 0–5
// ─────────────────────────────────────────────
export const respostasTransicao = sqliteTable("respostas_transicao", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  avaliacaoId: integer("avaliacao_id")
    .notNull()
    .references(() => avaliacoes.id, { onDelete: "cascade" }),
  transicaoId: text("transicao_id").notNull(),
  numero: integer("numero").notNull(), // 1–18
  pontuacao: integer("pontuacao"), // 0–5
  observacao: text("observacao"),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
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
