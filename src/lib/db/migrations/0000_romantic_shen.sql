CREATE TABLE "avaliacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"paciente_id" integer NOT NULL,
	"numero" integer NOT NULL,
	"data_avaliacao" text NOT NULL,
	"idade_em_meses" integer,
	"terapeuta" text,
	"status" text DEFAULT 'em_andamento' NOT NULL,
	"observacoes_gerais" text,
	"criado_em" text DEFAULT now() NOT NULL,
	"atualizado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pacientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"data_nascimento" text NOT NULL,
	"diagnostico" text,
	"responsavel" text,
	"telefone_responsavel" text,
	"data_inicio" text,
	"observacoes" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" text DEFAULT now() NOT NULL,
	"atualizado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "respostas_barreiras" (
	"id" serial PRIMARY KEY NOT NULL,
	"avaliacao_id" integer NOT NULL,
	"barreira_id" text NOT NULL,
	"numero" integer NOT NULL,
	"pontuacao" integer,
	"observacao" text,
	"criado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "respostas_marcos" (
	"id" serial PRIMARY KEY NOT NULL,
	"avaliacao_id" integer NOT NULL,
	"marco_id" text NOT NULL,
	"area" text NOT NULL,
	"nivel" integer NOT NULL,
	"item" integer NOT NULL,
	"pontuacao" real,
	"observacao" text,
	"criado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "respostas_transicao" (
	"id" serial PRIMARY KEY NOT NULL,
	"avaliacao_id" integer NOT NULL,
	"transicao_id" text NOT NULL,
	"numero" integer NOT NULL,
	"pontuacao" integer,
	"observacao" text,
	"criado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respostas_barreiras" ADD CONSTRAINT "respostas_barreiras_avaliacao_id_avaliacoes_id_fk" FOREIGN KEY ("avaliacao_id") REFERENCES "public"."avaliacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respostas_marcos" ADD CONSTRAINT "respostas_marcos_avaliacao_id_avaliacoes_id_fk" FOREIGN KEY ("avaliacao_id") REFERENCES "public"."avaliacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respostas_transicao" ADD CONSTRAINT "respostas_transicao_avaliacao_id_avaliacoes_id_fk" FOREIGN KEY ("avaliacao_id") REFERENCES "public"."avaliacoes"("id") ON DELETE cascade ON UPDATE no action;