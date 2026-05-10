"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AREAS, MARCOS, type Area } from "@/lib/vbmapp-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultadoAvaliacaoProps {
  respostas: Record<string, number | null>;
}

const NIVEL_COR = {
  1: "#4477CC",
  2: "#44AA77",
  3: "#CC8844",
} as const;

const NIVEL_LABEL = {
  1: "Nível 1 (0–18m)",
  2: "Nível 2 (18–30m)",
  3: "Nível 3 (30–48m)",
} as const;

function calcularPontuacaoPorAreaENivel(
  area: Area,
  nivel: 1 | 2 | 3,
  respostas: Record<string, number | null>
) {
  const marcos = MARCOS.filter((m) => m.area === area && m.nivel === nivel);
  const obtido = marcos.reduce((acc, m) => acc + (respostas[m.id] ?? 0), 0);
  const maximo = marcos.reduce((acc, m) => acc + m.pontuacaoMaxima, 0);
  return { obtido, maximo };
}

export function ResultadoAvaliacao({ respostas }: ResultadoAvaliacaoProps) {
  const areas = Object.entries(AREAS) as [Area, string][];

  // Dados para o gráfico principal (pontuação por área por nível)
  const dadosGrafico = areas.map(([area, nome]) => {
    const n1 = calcularPontuacaoPorAreaENivel(area, 1, respostas);
    const n2 = calcularPontuacaoPorAreaENivel(area, 2, respostas);
    const n3 = calcularPontuacaoPorAreaENivel(area, 3, respostas);
    return {
      area: nome.length > 12 ? nome.slice(0, 11) + "…" : nome,
      nomeCompleto: nome,
      nivel1: n1.obtido,
      nivel2: n2.obtido,
      nivel3: n3.obtido,
      maxN1: n1.maximo,
      maxN2: n2.maximo,
      maxN3: n3.maximo,
      total: n1.obtido + n2.obtido + n3.obtido,
      maximo: n1.maximo + n2.maximo + n3.maximo,
    };
  });

  // Pontuação total por nível
  const totalPorNivel = ([1, 2, 3] as const).map((nivel) => {
    const marcos = MARCOS.filter((m) => m.nivel === nivel);
    const obtido = marcos.reduce((acc, m) => acc + (respostas[m.id] ?? 0), 0);
    const maximo = marcos.reduce((acc, m) => acc + m.pontuacaoMaxima, 0);
    const pct = maximo > 0 ? Math.round((obtido / maximo) * 100) : 0;
    return { nivel, obtido, maximo, pct };
  });

  const totalGeral = {
    obtido: totalPorNivel.reduce((acc, n) => acc + n.obtido, 0),
    maximo: totalPorNivel.reduce((acc, n) => acc + n.maximo, 0),
  };

  const respondidos = Object.values(respostas).filter((v) => v !== null && v !== undefined).length;
  const totalMarcos = MARCOS.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const item = dadosGrafico.find((d) => d.area === label);
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-md text-sm">
        <p className="font-medium mb-2">{item?.nomeCompleto}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.fill }}>
            {p.name}: {p.value.toFixed(1)} pts
          </p>
        ))}
        <p className="text-muted-foreground mt-1">
          Total: {item?.total.toFixed(1)} / {item?.maximo} pts
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Resumo por nível */}
      <div className="grid grid-cols-4 gap-4">
        {totalPorNivel.map(({ nivel, obtido, maximo, pct }) => (
          <Card key={nivel}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {NIVEL_LABEL[nivel as keyof typeof NIVEL_LABEL]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ color: NIVEL_COR[nivel as keyof typeof NIVEL_COR] }}>
                {obtido.toFixed(1)}
                <span className="text-sm text-muted-foreground font-normal"> / {maximo}</span>
              </p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: NIVEL_COR[nivel as keyof typeof NIVEL_COR],
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pct}% atingido</p>
            </CardContent>
          </Card>
        ))}

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {totalGeral.obtido.toFixed(1)}
              <span className="text-sm text-muted-foreground font-normal"> / {totalGeral.maximo}</span>
            </p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${totalGeral.maximo > 0 ? Math.round((totalGeral.obtido / totalGeral.maximo) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {respondidos}/{totalMarcos} marcos respondidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras por área */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Perfil VB-MAPP — Pontuação por área</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 4, right: 8, left: 0, bottom: 60 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="area"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(value) => NIVEL_LABEL[Number(value.replace("nivel", "")) as keyof typeof NIVEL_LABEL]}
              />
              <Bar dataKey="nivel1" name="nivel1" stackId="a" fill={NIVEL_COR[1]} radius={[0, 0, 0, 0]} />
              <Bar dataKey="nivel2" name="nivel2" stackId="a" fill={NIVEL_COR[2]} radius={[0, 0, 0, 0]} />
              <Bar dataKey="nivel3" name="nivel3" stackId="a" fill={NIVEL_COR[3]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de pontuações por área */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pontuação detalhada por área</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left py-2 pr-4 font-medium">Área</th>
                  <th className="text-center py-2 px-2 font-medium" style={{ color: NIVEL_COR[1] }}>N1</th>
                  <th className="text-center py-2 px-2 font-medium" style={{ color: NIVEL_COR[2] }}>N2</th>
                  <th className="text-center py-2 px-2 font-medium" style={{ color: NIVEL_COR[3] }}>N3</th>
                  <th className="text-center py-2 pl-4 font-medium">Total</th>
                  <th className="text-left py-2 pl-4 font-medium w-32">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {dadosGrafico.map((d) => {
                  const pct = d.maximo > 0 ? (d.total / d.maximo) * 100 : 0;
                  return (
                    <tr key={d.area} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 pr-4 font-medium">{d.nomeCompleto}</td>
                      <td className="text-center py-2 px-2 tabular-nums">
                        {d.nivel1.toFixed(1)}<span className="text-muted-foreground text-xs">/{d.maxN1}</span>
                      </td>
                      <td className="text-center py-2 px-2 tabular-nums">
                        {d.nivel2.toFixed(1)}<span className="text-muted-foreground text-xs">/{d.maxN2}</span>
                      </td>
                      <td className="text-center py-2 px-2 tabular-nums">
                        {d.nivel3.toFixed(1)}<span className="text-muted-foreground text-xs">/{d.maxN3}</span>
                      </td>
                      <td className="text-center py-2 pl-4 font-semibold tabular-nums">
                        {d.total.toFixed(1)}<span className="text-muted-foreground text-xs font-normal">/{d.maximo}</span>
                      </td>
                      <td className="py-2 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: pct >= 70 ? NIVEL_COR[2] : pct >= 40 ? NIVEL_COR[3] : NIVEL_COR[1],
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {Math.round(pct)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
