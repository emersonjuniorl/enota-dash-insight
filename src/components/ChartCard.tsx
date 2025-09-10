import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  icon: ReactNode;
  data: any[];
  field: string;
  colorMapping?: Record<string, string>;
}

// Color palette for charts
const CHART_COLORS = [
  'hsl(217, 75%, 45%)',   // Primary blue
  'hsl(142, 76%, 36%)',   // Success green  
  'hsl(38, 92%, 50%)',    // Warning orange
  'hsl(0, 75%, 55%)',     // Destructive red
  'hsl(199, 89%, 48%)',   // Info cyan
  'hsl(264, 75%, 55%)',   // Purple
  'hsl(295, 75%, 55%)',   // Pink
  'hsl(45, 75%, 55%)',    // Yellow
];

export const ChartCard = ({ title, icon, data, field, colorMapping }: ChartCardProps) => {
  // Count occurrences of each value in the field
  const valueCounts = data.reduce((acc, item) => {
    const value = item[field];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart data format
  const chartData = Object.entries(valueCounts).map(([name, value], index) => ({
    name,
    value: value as number,
    color: colorMapping?.[name] || CHART_COLORS[index % CHART_COLORS.length]
  }));

  const total = data.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? Math.round((data.value / total) * 100) : 0;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-foreground">{data.payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} items ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center border-t border-border pt-4">
          <div>
            <div className="text-2xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{chartData.length}</div>
            <div className="text-xs text-muted-foreground">Categorias</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};