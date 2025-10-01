import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { KanbanBoard } from "./KanbanBoard";
import { ChartCard } from "./ChartCard";
import { BurndownChart } from "./BurndownChart";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { BarChart3, PieChart, TrendingUp, Users, Building, CheckCircle, Loader2, Menu } from "lucide-react";

// Color mappings for charts
const statusImplantacaoColors = {
  "Não iniciada": "hsl(var(--destructive))",
  "Em execução": "hsl(var(--warning))",
  "Operação Assistida": "hsl(var(--info))",
  "Concluída": "hsl(var(--success))"
};

const tributosCloudColors = {
  "Não Contratado": "hsl(var(--destructive))",
  "Contratado/Aguardando Implantação": "hsl(var(--warning))",
  "Em Andamento": "hsl(var(--info))",
  "Implantado": "hsl(var(--success))"
};

const liberadoCrmColors = {
  "Não Contratado": "hsl(var(--destructive))",
  "Contratado": "hsl(var(--warning))",
  "Liberado": "hsl(var(--success))"
};

const migracaoColors = {
  "Não Iniciada": "hsl(var(--destructive))",
  "Em Execução": "hsl(var(--warning))",
  "Em Conferência": "hsl(var(--info))",
  "Concluída": "hsl(var(--success))"
};

const conferenciaMigracaoColors = {
  "Não Iniciada": "hsl(var(--destructive))",
  "Em Execução": "hsl(var(--warning))",
  "Concluída": "hsl(var(--success))"
};

const ajusteFormulaColors = {
  "Não iniciada": "hsl(var(--destructive))",
  "Não Iniciada": "hsl(var(--destructive))",
  "Em Execução": "hsl(var(--warning))",
  "Em execução": "hsl(var(--warning))",
  "Concluída": "hsl(var(--success))",
  "Concluida": "hsl(var(--success))",
  "Não se Aplica": "hsl(var(--muted))",
  "Não se aplica": "hsl(var(--muted))",
  "N/A": "hsl(var(--muted))"
};

const ajusteRelatoriosColors = {
  "Não iniciada": "hsl(var(--destructive))",
  "Não Iniciada": "hsl(var(--destructive))",
  "Em Execução": "hsl(var(--warning))",
  "Em execução": "hsl(var(--warning))",
  "Concluída": "hsl(var(--success))",
  "Concluida": "hsl(var(--success))",
  "Não se Aplica": "hsl(var(--muted))",
  "Não se aplica": "hsl(var(--muted))",
  "N/A": "hsl(var(--muted))"
};

const treinamentoColors = {
  "Não iniciada": "hsl(var(--destructive))",
  "Não Iniciada": "hsl(var(--destructive))",
  "Em Execução": "hsl(var(--warning))",
  "Em execução": "hsl(var(--warning))",
  "Concluída": "hsl(var(--success))",
  "Concluida": "hsl(var(--success))",
  "Não se Aplica": "hsl(var(--muted))",
  "Não se aplica": "hsl(var(--muted))",
  "N/A": "hsl(var(--muted))"
};

const viradaChaveColors = {
  "Não iniciada": "hsl(var(--destructive))",
  "Não Iniciada": "hsl(var(--destructive))",
  "Aguardando Data": "hsl(var(--warning))",
  "Bloqueada": "hsl(38, 92%, 50%)", // Orange
  "Concluída": "hsl(var(--success))",
  "Concluida": "hsl(var(--success))"
};

export interface FilterState {
  municipios: string[];
  portfolios: string[];
  statusImplantacao: string[];
  tributosCloud: string[];
  liberadoCrm: string[];
}

export const Dashboard = () => {
  const { data: sheetData, loading, error } = useGoogleSheetData();
  const [filters, setFilters] = useState<FilterState>({
    municipios: [],
    portfolios: [],
    statusImplantacao: [],
    tributosCloud: [],
    liberadoCrm: []
  });

  // Filter data based on active filters
  const filteredData = sheetData.filter(item => {
    return (
      (filters.municipios.length === 0 || filters.municipios.includes(item.municipio)) &&
      (filters.portfolios.length === 0 || filters.portfolios.includes(item.portfolio)) &&
      (filters.statusImplantacao.length === 0 || filters.statusImplantacao.includes(item.statusImplantacao)) &&
      (filters.tributosCloud.length === 0 || filters.tributosCloud.includes(item.tributosCloud)) &&
      (filters.liberadoCrm.length === 0 || filters.liberadoCrm.includes(item.liberadoCrm))
    );
  });

  // Calculate metrics
  const totalMunicipios = filteredData.length;
  const concluidos = filteredData.filter(item => item.statusImplantacao === "Concluída").length;
  const emExecucao = filteredData.filter(item => item.statusImplantacao === "Em execução").length;
  const tributosImplantados = filteredData.filter(item => item.tributosCloud === "Implantado").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="flex items-center gap-2 text-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados da planilha...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">Erro ao carregar dados: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-dashboard-bg">
        <AppSidebar 
          data={sheetData} 
          filters={filters} 
          onFiltersChange={setFilters} 
        />
        
        <SidebarInset className="flex-1">
          {/* Header with toggle */}
          <header className="flex h-12 items-center gap-2 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="flex items-center gap-2 text-sm">
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-semibold text-foreground">
                Painel eNota Cloud
              </h1>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 space-y-6">
            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground">
              Acompanhe o progresso da implantação do sistema nos municípios
            </p>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <Card className="bg-gradient-card shadow-soft border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    Total de Municípios
                  </CardTitle>
                  <Building className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-foreground">{totalMunicipios}</div>
                  <Badge variant="secondary" className="mt-1 md:mt-2 text-xs">
                    {sheetData.length} total
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    Concluídos
                  </CardTitle>
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-foreground">{concluidos}</div>
                  <Badge variant="secondary" className="mt-1 md:mt-2 bg-success/10 text-success text-xs">
                    {totalMunicipios > 0 ? Math.round((concluidos / totalMunicipios) * 100) : 0}%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    Em Execução
                  </CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-foreground">{emExecucao}</div>
                  <Badge variant="secondary" className="mt-1 md:mt-2 bg-warning/10 text-warning text-xs">
                    {totalMunicipios > 0 ? Math.round((emExecucao / totalMunicipios) * 100) : 0}%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    Tributos Implantados
                  </CardTitle>
                  <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-info" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-foreground">{tributosImplantados}</div>
                  <Badge variant="secondary" className="mt-1 md:mt-2 bg-info/10 text-info text-xs">
                    {totalMunicipios > 0 ? Math.round((tributosImplantados / totalMunicipios) * 100) : 0}%
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <KanbanBoard data={filteredData} />

            {/* Burndown Chart */}
            <BurndownChart data={filteredData} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <ChartCard
                title="Status da Implantação"
                icon={<TrendingUp className="h-5 w-5" />}
                data={filteredData}
                field="statusImplantacao"
                colorMapping={statusImplantacaoColors}
              />
              
              <ChartCard
                title="Tributos Cloud"
                icon={<BarChart3 className="h-5 w-5" />}
                data={filteredData}
                field="tributosCloud"
                colorMapping={tributosCloudColors}
              />
              
              <ChartCard
                title="Liberado CRM"
                icon={<Users className="h-5 w-5" />}
                data={filteredData}
                field="liberadoCrm"
                colorMapping={liberadoCrmColors}
              />
              
              <ChartCard
                title="Migração"
                icon={<PieChart className="h-5 w-5" />}
                data={filteredData}
                field="migracao"
                colorMapping={migracaoColors}
              />
              
              <ChartCard
                title="Ajuste Fórmula"
                icon={<BarChart3 className="h-5 w-5" />}
                data={filteredData}
                field="ajusteFormula"
                colorMapping={ajusteFormulaColors}
              />
              
              <ChartCard
                title="Ajuste Relatórios"
                icon={<PieChart className="h-5 w-5" />}
                data={filteredData}
                field="ajusteRelatorios"
                colorMapping={ajusteRelatoriosColors}
              />
              
              <ChartCard
                title="Treinamento"
                icon={<Users className="h-5 w-5" />}
                data={filteredData}
                field="treinamento"
                colorMapping={treinamentoColors}
              />
              
              <ChartCard
                title="Virada de Chave"
                icon={<TrendingUp className="h-5 w-5" />}
                data={filteredData}
                field="viradaChave"
                colorMapping={viradaChaveColors}
              />
              
              <ChartCard
                title="Conferência Migração"
                icon={<PieChart className="h-5 w-5" />}
                data={filteredData}
                field="conferenciaMigracao"
                colorMapping={conferenciaMigracaoColors}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};