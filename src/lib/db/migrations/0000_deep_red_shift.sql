CREATE TABLE `avaliacoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`paciente_id` integer NOT NULL,
	`numero` integer NOT NULL,
	`data_avaliacao` text NOT NULL,
	`idade_em_meses` integer,
	`terapeuta` text,
	`status` text DEFAULT 'em_andamento' NOT NULL,
	`observacoes_gerais` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`atualizado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pacientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`data_nascimento` text NOT NULL,
	`diagnostico` text,
	`responsavel` text,
	`telefone_responsavel` text,
	`data_inicio` text,
	`observacoes` text,
	`ativo` integer DEFAULT true NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	`atualizado_em` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `respostas_barreiras` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`avaliacao_id` integer NOT NULL,
	`barreira_id` text NOT NULL,
	`numero` integer NOT NULL,
	`pontuacao` integer,
	`observacao` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`avaliacao_id`) REFERENCES `avaliacoes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `respostas_marcos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`avaliacao_id` integer NOT NULL,
	`marco_id` text NOT NULL,
	`area` text NOT NULL,
	`nivel` integer NOT NULL,
	`item` integer NOT NULL,
	`pontuacao` real,
	`observacao` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`avaliacao_id`) REFERENCES `avaliacoes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `respostas_transicao` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`avaliacao_id` integer NOT NULL,
	`transicao_id` text NOT NULL,
	`numero` integer NOT NULL,
	`pontuacao` integer,
	`observacao` text,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`avaliacao_id`) REFERENCES `avaliacoes`(`id`) ON UPDATE no action ON DELETE cascade
);
