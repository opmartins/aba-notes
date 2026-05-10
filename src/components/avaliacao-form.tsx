"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";
import { AREAS, MARCOS, type Area, type Marco } from "@/lib/vbmapp-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResultadoAvaliacao } from "@/components/resultado-avaliacao";
import { cn } from "@/lib/utils";

interface AvaliacaoFormProps {
  avaliacaoId: number;
  pacienteId: number;
  respostasIniciais: Record<string, number | null>;
  statusInicial: "em_andamento" | "concluida";
}

const NIVEL_CORES: Record<number, string> = {
  1: "bg-[oklch(0.55_0.18_250)] text-white",
  2: "bg-[oklch(0.55_0.15_150)] text-white",
  3: "bg-[oklch(0.65_0.18_60)] text-white",
};

const NIVEL_BORDA: Record<number, string> = {
  1: "border-[oklch(0.55_0.18_250/0.3)]",
  2: "border-[oklch(0.55_0.15_150/0.3)]",
  3: "border-[oklch(0.65_0.18_60/0.3)]",
};

const PONTUACOES: { valor: number | null; label: string }[] = [
  { valor: null, label: "—" },
  { valor: 0, label: "0" },
  { valor: 0.5, label: "½" },
  { valor: 1, label: "1" },
];

function MarcoRow({
  marco,
  pontuacao,
  bloqueado,
  onChange,
}: {
  marco: Marco;
  pontuacao: number | null | undefined;
  bloqueado: boolean;
  onChange: (marcoId: string, valor: number | null) => void;
}) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div
      className={cn(
        "border rounded-lg p-3 transition-colors",
        NIVEL_BORDA[marco.nivel],
        pontuacao != null && pontuacao > 0 && "bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", NIVEL_CORES[marco.nivel])}>
            N{marco.nivel}
          </span>
          <span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
            {marco.codigo}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm cursor-pointer hover:text-primary"
            onClick={() => setExpandido((v) => !v)}
          >
            {marco.descricao}
          </p>
          {expandido && (
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed border-t pt-1.5">
              <strong>Critério:</strong> {marco.criterio}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {PONTUACOES.map(({ valor, label }) => (
            <button
              key={String(valor)}
              type="button"
              disabled={bloqueado}
              onClick={() => !bloqueado && onChange(marco.id, valor)}
              className={cn(
                "w-10 h-8 rounded text-sm font-medium border transition-colors",
                pontuacao === valor
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted text-foreground",
                bloqueado && "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AvaliacaoForm({
  avaliacaoId,
  pacienteId,
  respostasIniciais,
  statusInicial,
}: AvaliacaoFormProps) {
  const [respostas, setRespostas] = useState<Record<string, number | null>>(respostasIniciais);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [areaAtiva, setAreaAtiva] = useState<Area>(Object.keys(AREAS)[0] as Area);
  const [status, setStatus] = useState(statusInicial);
  const [concluindo, setConcluindo] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<string>(statusInicial === "concluida" ? "resultado" : "marcos");
  const router = useRouter();

  const concluida = status === "concluida";

  const salvarResposta = useCallback(
    async (marcoId: string, valor: number | null) => {
      setRespostas((prev) => ({ ...prev, [marcoId]: valor }));
      setSalvando(marcoId);
      const marco = MARCOS.find((m) => m.id === marcoId)!;
      try {
        await fetch(`/api/avaliacoes/${avaliacaoId}/marcos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            marcoId,
            area: marco.area,
            nivel: marco.nivel,
            item: marco.item,
            pontuacao: valor,
          }),
        });
      } catch {
        toast.error("Erro ao salvar resposta");
      } finally {
        setSalvando(null);
      }
    },
    [avaliacaoId]
  );

  const concluirAvaliacao = async () => {
    setConcluindo(true);
    try {
      const res = await fetch(`/api/avaliacoes/${avaliacaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "concluida" }),
      });
      if (!res.ok) throw new Error();
      setStatus("concluida");
      setAbaAtiva("resultado");
      toast.success("Avaliação concluída!");
      router.refresh();
    } catch {
      toast.error("Erro ao concluir avaliação");
    } finally {
      setConcluindo(false);
    }
  };

  const reabrirAvaliacao = async () => {
    try {
      await fetch(`/api/avaliacoes/${avaliacaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "em_andamento" }),
      });
      setStatus("em_andamento");
      toast.success("Avaliação reaberta para edição");
      router.refresh();
    } catch {
      toast.error("Erro ao reabrir avaliação");
    }
  };

  const marcosArea = MARCOS.filter((m) => m.area === areaAtiva);
  const respondidos = Object.values(respostas).filter((v) => v !== null && v !== undefined).length;
  const totalMarcos = MARCOS.length;

  const pontuacaoArea = marcosArea.reduce((acc, m) => acc + (respostas[m.id] ?? 0), 0);
  const maxArea = marcosArea.reduce((acc, m) => acc + m.pontuacaoMaxima, 0);
  const respondidosArea = marcosArea.filter((m) => respostas[m.id] !== null && respostas[m.id] !== undefined).length;

  return (
    <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
      {/* Barra superior: tabs + botão concluir */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <TabsList>
          <TabsTrigger value="marcos">
            Marcos
            <span className="ml-1.5 text-xs opacity-70">
              {respondidos}/{totalMarcos}
            </span>
          </TabsTrigger>
          <TabsTrigger value="resultado">Resultado</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          {salvando && (
            <span className="text-xs text-muted-foreground animate-pulse">Salvando...</span>
          )}
          {concluida ? (
            <Button variant="outline" size="sm" onClick={reabrirAvaliacao}>
              Reabrir para edição
            </Button>
          ) : (
            <Button onClick={concluirAvaliacao} disabled={concluindo}>
              <CheckCircleIcon className="h-4 w-4" />
              {concluindo ? "Concluindo..." : "Concluir avaliação"}
            </Button>
          )}
        </div>
      </div>

      {/* Aba: Marcos */}
      <TabsContent value="marcos">
        <div className="flex gap-6">
          {/* Sidebar de áreas */}
          <aside className="w-52 shrink-0 space-y-1 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            {(Object.entries(AREAS) as [Area, string][]).map(([area, nome]) => {
              const marcosA = MARCOS.filter((m) => m.area === area);
              const resp = marcosA.filter((m) => respostas[m.id] !== null && respostas[m.id] !== undefined).length;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => setAreaAtiva(area)}
                  className={cn(
                    "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                    area === areaAtiva
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <span className="block truncate">{nome}</span>
                  <span className={cn("text-xs", area === areaAtiva ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {resp}/{marcosA.length}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Marcos da área */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{AREAS[areaAtiva]}</h2>
                <p className="text-sm text-muted-foreground">
                  {respondidosArea} de {marcosArea.length} respondidos ·{" "}
                  <strong>{pontuacaoArea.toFixed(1)}</strong>/{maxArea} pts
                </p>
              </div>
              {concluida && (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                  Avaliação concluída — edição bloqueada
                </span>
              )}
            </div>

            {([1, 2, 3] as const).map((nivel) => {
              const marcosNivel = marcosArea.filter((m) => m.nivel === nivel);
              if (marcosNivel.length === 0) return null;
              return (
                <Card key={nivel} className={cn("border", NIVEL_BORDA[nivel])}>
                  <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded", NIVEL_CORES[nivel])}>
                        Nível {nivel}
                      </span>
                      <span className="text-muted-foreground">
                        {nivel === 1 ? "0–18 meses" : nivel === 2 ? "18–30 meses" : "30–48 meses"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-4">
                    {marcosNivel.map((marco) => (
                      <MarcoRow
                        key={marco.id}
                        marco={marco}
                        pontuacao={respostas[marco.id]}
                        bloqueado={concluida}
                        onChange={salvarResposta}
                      />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </TabsContent>

      {/* Aba: Resultado */}
      <TabsContent value="resultado">
        {!concluida && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 flex items-center justify-between gap-4">
            <span>Você pode visualizar o resultado parcial. Conclua a avaliação para finalizar o registro.</span>
            <Button size="sm" onClick={concluirAvaliacao} disabled={concluindo}>
              <CheckCircleIcon className="h-4 w-4" />
              {concluindo ? "Concluindo..." : "Concluir agora"}
            </Button>
          </div>
        )}
        <ResultadoAvaliacao respostas={respostas} />
      </TabsContent>
    </Tabs>
  );
}
