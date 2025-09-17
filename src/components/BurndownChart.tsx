//AJUSTES EJL
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown } from "lucide-react";
import { MunicipioData } from "@/hooks/useGoogleSheetData";
import { format, addWeeks, parseISO, isValid, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BurndownChartProps {
  data: MunicipioData[];
}

export const BurndownChart = ({ data }: BurndownChartProps) => {
  // Configurações do projeto
  const startDate = new Date(2025, 8, 8); // 08/09/2025 (mês é 0-indexed)
  const endDate = new Date(2025, 11, 19); // 19/12/2025
  const totalWeeks = 15;
  const totalMunicipios = data.length;

  // Gerar dados das semanas
  const generateWeeklyData = () => {
    const weeklyData = [];
    
    // Contar municípios finalizados por semana
    const municipiosFinalizadosPorSemana: { [key: string]: number } = {};
    
    data.forEach(municipio => {
      if (municipio.dataVirada && municipio.dataVirada.trim()) {
        try {
          // Tentar diferentes formatos de data
          let dataVirada: Date | null = null;
          
          // Formato DD/MM/YYYY
          if (municipio.dataVirada.includes('/')) {
            const [day, month, year] = municipio.dataVirada.split('/');
            dataVirada = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          }
          // Formato YYYY-MM-DD
          else if (municipio.dataVirada.includes('-')) {
            dataVirada = parseISO(municipio.dataVirada);
          }
          
          if (dataVirada && isValid(dataVirada) && dataVirada >= startDate && dataVirada <= endDate) {
            const weekStart = startOfWeek(dataVirada, { weekStartsOn: 1 }); // Segunda-feira
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            municipiosFinalizadosPorSemana[weekKey] = (municipiosFinalizadosPorSemana[weekKey] || 0) + 1;
          }
        } catch (error) {
          console.warn('Erro ao parsear data:', municipio.dataVirada);
        }
      }
    });

    let municipiosFinalizadosAcumulado = 0;

    for (let week = 0; week < totalWeeks; week++) {
      const currentWeekStart = addWeeks(startDate, week);
      const weekKey = format(currentWeekStart, 'yyyy-MM-dd');
      
      // Linha ideal (burndown linear)
      const idealRemaining = totalMunicipios - Math.round((totalMunicipios * week) / (totalWeeks - 1));
      
      // Municípios finalizados nesta semana
      const finalizadosNestaSemana = municipiosFinalizadosPorSemana[weekKey] || 0;
      municipiosFinalizadosAcumulado += finalizadosNestaSemana;
      
      // Municípios restantes (real)
      const realRemaining = totalMunicipios - municipiosFinalizadosAcumulado;
      
      weeklyData.push({
        semana: `S${week + 1}`,
        data: format(currentWeekStart, 'dd/MM', { locale: ptBR }),
        ideal: Math.max(0, idealRemaining),
        real: Math.max(0, realRemaining),
        finalizados: finalizadosNestaSemana
      });
    }

    // ===== Série PROJETADO baseada até a SEMANA ATUAL do calendário =====
    const today = new Date();
    let semanaAtualIndex = 0;
    for (let i = 0; i < totalWeeks; i++) {
      const currentWeekStart = addWeeks(startDate, i);
      if (currentWeekStart <= today) semanaAtualIndex = i;
    }

    const t0 = Math.min(Math.max(0, semanaAtualIndex), totalWeeks - 1); // pivô na semana atual
    const realAtual = weeklyData[t0]?.real ?? totalMunicipios;
    const semanasConcluidas = Math.max(1, t0);
    const concluidoAteAgora = totalMunicipios - realAtual;
    const velocidadeSemanal = concluidoAteAgora / semanasConcluidas; // municípios/semana

    for (let i = 0; i < weeklyData.length; i++) {
      if (i < t0) {
        weeklyData[i].projetado = null; // não plota no passado
      } else {
        const semanasDesdeT0 = i - t0;
        const restante = Math.max(realAtual - velocidadeSemanal * semanasDesdeT0, 0);
        weeklyData[i].projetado = Math.round(restante);
      }
    }

    const semanasRestantesProjetadas = Math.ceil(
      realAtual / Math.max(velocidadeSemanal, 0.000001)
    );
    const semanasPlanejadasRestantes = totalWeeks - (t0 + 1);
    (weeklyData).__meta = {
      deltaSemanas: semanasRestantesProjetadas - semanasPlanejadasRestantes
    };

    return weeklyData;
  };

  const chartData = generateWeeklyData();

  const deltaSemanas = chartData.__meta?.deltaSemanas;
  const deltaTexto =
    deltaSemanas === null || deltaSemanas === undefined
      ? 'sem entregas para projetar'
      : deltaSemanas === 0
      ? 'no prazo'
      : deltaSemanas > 0
      ? `${deltaSemanas} semana(s) de atraso`
      : `${Math.abs(deltaSemanas)} semana(s) adiantado`;

  const chartConfig = {
    ideal: {
      label: "Planejado",
      color: "hsl(var(--primary))"
    },
    real: {
      label: "Real", 
      color: "hsl(var(--success))"
    },
    projetado: {
      label: "Projetado",
      color: "hsl(var(--warning))"
    }
  };

  return (
    <Card className="bg-gradient-card shadow-soft border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Burndown Chart
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Progresso de implantação vs. planejamento ({totalMunicipios} municípios) — {deltaTexto}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="semana" 
                tick={{ fontSize: 11 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{ 
                  value: 'Municípios Restantes', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '11px' }
                }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => {
                    const suffix = name === 'ideal'
                      ? 'municípiosPlanejado'
                      : name === 'real'
                      ? 'municípiosReal'
                      : 'municípiosProjetado';
                    const displayName = name === 'ideal' ? 'Planejado' : name === 'real' ? 'Real' : 'Projetado';
                    return [`${value} ${suffix}`, displayName];
                  }}
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${label} (${data.data})` : label;
                  }}
                />}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="ideal" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                name="Planejado"
              />
              <Line 
                type="monotone" 
                dataKey="real" 
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                name="Real"
              />
              <Line 
                type="monotone" 
                dataKey="projetado" 
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={false}
                name="Projetado"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
