CREATE TABLE "supervisoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"supervisor_id" text NOT NULL,
	"terapeuta_id" text NOT NULL,
	"criado_em" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pacientes" ADD COLUMN "terapeuta_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pacientes" ADD COLUMN "responsavel_user_id" text;