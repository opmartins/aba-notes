CREATE TABLE "convites" (
	"id" serial PRIMARY KEY NOT NULL,
	"paciente_id" integer NOT NULL,
	"email" text NOT NULL,
	"clerk_invitation_id" text NOT NULL,
	"criado_por_user_id" text NOT NULL,
	"criado_em" text DEFAULT now() NOT NULL,
	"expira_em" text NOT NULL,
	"aceito_em" text,
	"revogado_em" text
);
--> statement-breakpoint
ALTER TABLE "convites" ADD CONSTRAINT "convites_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE cascade ON UPDATE no action;