"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pacienteSchema, type PacienteFormData } from "@/lib/validators/paciente";
import { type Paciente } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PacienteFormProps {
  paciente?: Paciente;
  onSucesso: (paciente: Paciente) => void;
  onCancelar: () => void;
}

export function PacienteForm({ paciente, onSucesso, onCancelar }: PacienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: paciente
      ? {
          nome: paciente.nome,
          dataNascimento: paciente.dataNascimento,
          diagnostico: paciente.diagnostico ?? "",
          responsavel: paciente.responsavel ?? "",
          telefoneResponsavel: paciente.telefoneResponsavel ?? "",
          dataInicio: paciente.dataInicio ?? "",
          observacoes: paciente.observacoes ?? "",
        }
      : { dataInicio: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (dados: PacienteFormData) => {
    try {
      const url = paciente ? `/api/pacientes/${paciente.id}` : "/api/pacientes";
      const method = paciente ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const salvo: Paciente = await res.json();
      toast.success(paciente ? "Paciente atualizado!" : "Paciente cadastrado!");
      onSucesso(salvo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar paciente");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" {...register("nome")} placeholder="Nome do paciente" />
          {errors.nome && <p className="text-destructive text-sm">{errors.nome.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dataNascimento">Data de nascimento *</Label>
          <Input id="dataNascimento" type="date" {...register("dataNascimento")} />
          {errors.dataNascimento && (
            <p className="text-destructive text-sm">{errors.dataNascimento.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dataInicio">Início do atendimento</Label>
          <Input id="dataInicio" type="date" {...register("dataInicio")} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="diagnostico">Diagnóstico</Label>
          <Input
            id="diagnostico"
            {...register("diagnostico")}
            placeholder="Ex: TEA (F84.0), CID-11 6A02"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="responsavel">Responsável</Label>
          <Input id="responsavel" {...register("responsavel")} placeholder="Nome do responsável" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefoneResponsavel">Telefone</Label>
          <Input
            id="telefoneResponsavel"
            {...register("telefoneResponsavel")}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            placeholder="Informações adicionais relevantes..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancelar} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : paciente ? "Salvar alterações" : "Cadastrar paciente"}
        </Button>
      </div>
    </form>
  );
}
