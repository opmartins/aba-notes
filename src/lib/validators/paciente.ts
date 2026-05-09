import { z } from "zod";

export const pacienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  diagnostico: z.string().optional(),
  responsavel: z.string().optional(),
  telefoneResponsavel: z.string().optional(),
  dataInicio: z.string().optional(),
  observacoes: z.string().optional(),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;
