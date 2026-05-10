"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calcularIdadeEmMeses } from "@/lib/utils";
import { toast } from "sonner";

interface NovaAvaliacaoButtonProps {
  pacienteId: number;
  proximoNumero: number;
  variant?: "default" | "outline";
}

export function NovaAvaliacaoButton({
  pacienteId,
  proximoNumero,
  variant = "default",
}: NovaAvaliacaoButtonProps) {
  const [criando, setCriando] = useState(false);
  const router = useRouter();

  const criarAvaliacao = async () => {
    setCriando(true);
    try {
      const pacienteRes = await fetch(`/api/pacientes/${pacienteId}`);
      const paciente = await pacienteRes.json();

      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId,
          numero: proximoNumero,
          dataAvaliacao: new Date().toISOString().split("T")[0],
          idadeEmMeses: calcularIdadeEmMeses(paciente.dataNascimento),
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar avaliação");

      const avaliacao = await res.json();
      router.push(`/pacientes/${pacienteId}/avaliacoes/${avaliacao.id}`);
    } catch {
      toast.error("Erro ao criar avaliação");
      setCriando(false);
    }
  };

  return (
    <Button variant={variant} onClick={criarAvaliacao} disabled={criando}>
      <PlusIcon className="h-4 w-4" />
      {criando ? "Criando..." : "Nova avaliação"}
    </Button>
  );
}
