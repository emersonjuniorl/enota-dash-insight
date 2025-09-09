import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiltersSidebar } from "./FiltersSidebar";
import { KanbanBoard } from "./KanbanBoard";
import { ChartCard } from "./ChartCard";
import { BarChart3, PieChart, TrendingUp, Users, Building, CheckCircle } from "lucide-react";

// Mock data - will be replaced with Google Sheets integration
const mockData = [
  {
    id: 1,
    municipio: "São Paulo",
    proprietario: "João Silva",
    statusImplantacao: "Em Andamento",
    tributosCloud: "Ativo",
    liberadoCrm: "Sim",
    migracao: "Concluída",
    ajusteFormula: "Pendente",
    ajusteRelatorios: "Em Andamento",
    treinamento: "Agendado",
    viradaChave: "Não Iniciado"
  },
  {
    id: 2,
    municipio: "Rio de Janeiro",
    proprietario: "Maria Santos",
    statusImplantacao: "Concluído",
    tributosCloud: "Ativo",
    liberadoCrm: "Sim",
    migracao: "Concluída",
    ajusteFormula: "Concluída",
    ajusteRelatorios: "Concluída",
    treinamento: "Concluído",
    viradaChave: "Concluída"
  },
  {
    id: 3,
    municipio: "Belo Horizonte",
    proprietario: "Pedro Costa",
    statusImplantacao: "Planejamento",
    tributosCloud: "Inativo",
    liberadoCrm: "Não",
    migracao: "Não Iniciado",
    ajusteFormula: "Não Iniciado",
    ajusteRelatorios: "Não Iniciado",
    treinamento: "Não Agendado",
    viradaChave: "Não Iniciado"
  },
  {
    id: 4,
    municipio: "Salvador",
    proprietario: "Ana Lima",
    statusImplantacao: "Em Andamento",
    tributosCloud: "Ativo",
    liberadoCrm: "Sim",
    migracao: "Em Andamento",
    ajusteFormula: "Concluída",
    ajusteRelatorios: "Pendente",
    treinamento: "Em Andamento",
    viradaChave: "Não Iniciado"
  },
  {
    id: 5,
    municipio: "Brasília",
    proprietario: "Carlos Oliveira",
    statusImplantacao: "Bloqueado",
    tributosCloud: "Inativo",
    liberadoCrm: "Não",
    migracao: "Bloqueado",
    ajusteFormula: "Não Iniciado",
    ajusteRelatorios: "Não Iniciado",
    treinamento: "Não Agendado",
    viradaChave: "Não Iniciado"
  },
  {
    id: 6,
    municipio: "Fortaleza",
    proprietario: "Lucia Mendes",
    statusImplantacao: "Concluído",
    tributosCloud: "Ativo",
    liberadoCrm: "Sim",
    migracao: "Concluída",
    ajusteFormula: "Concluída",
    ajusteRelatorios: "Concluída",
    treinamento: "Concluído",
    viradaChave: "Concluída"
  }
];

export interface FilterState {
  municipios: string[];
  proprietarios: string[];
  statusImplantacao: string[];
  tributosCloud: string[];
  liberadoCrm: string[];
}

export const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>({
    municipios: [],
    proprietarios: [],
    statusImplantacao: [],
    tributosCloud: [],
    liberadoCrm: []
  });

  // Filter data based on active filters
  const filteredData = mockData.filter(item => {
    return (
      (filters.municipios.length === 0 || filters.municipios.includes(item.municipio)) &&
      (filters.proprietarios.length === 0 || filters.proprietarios.includes(item.proprietario)) &&
      (filters.statusImplantacao.length === 0 || filters.statusImplantacao.includes(item.statusImplantacao)) &&
      (filters.tributosCloud.length === 0 || filters.tributosCloud.includes(item.tributosCloud)) &&
      (filters.liberadoCrm.length === 0 || filters.liberadoCrm.includes(item.liberadoCrm))
    );
  });

  // Calculate metrics
  const totalMunicipios = filteredData.length;
  const concluidos = filteredData.filter(item => item.statusImplantacao === "Concluído").length;
  const emAndamento = filteredData.filter(item => item.statusImplantacao === "Em Andamento").length;
  const tributosAtivos = filteredData.filter(item => item.tributosCloud === "Ativo").length;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="flex">
        {/* Sidebar with filters */}
        <FiltersSidebar 
          data={mockData} 
          filters={filters} 
          onFiltersChange={setFilters} 
        />

        {/* Main content */}
        <div className="flex-1 p-6 ml-80">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Painel eNota Cloud
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o progresso da implantação do sistema nos municípios
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Municípios
                </CardTitle>
                <Building className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalMunicipios}</div>
                <Badge variant="secondary" className="mt-2">
                  {mockData.length} total
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Concluídos
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{concluidos}</div>
                <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                  {totalMunicipios > 0 ? Math.round((concluidos / totalMunicipios) * 100) : 0}%
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Em Andamento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{emAndamento}</div>
                <Badge variant="secondary" className="mt-2 bg-warning/10 text-warning">
                  {totalMunicipios > 0 ? Math.round((emAndamento / totalMunicipios) * 100) : 0}%
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tributos Ativos
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tributosAtivos}</div>
                <Badge variant="secondary" className="mt-2 bg-info/10 text-info">
                  {totalMunicipios > 0 ? Math.round((tributosAtivos / totalMunicipios) * 100) : 0}%
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="mb-8">
            <KanbanBoard data={filteredData} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <ChartCard
              title="Status da Implantação"
              icon={<TrendingUp className="h-5 w-5" />}
              data={filteredData}
              field="statusImplantacao"
            />
            
            <ChartCard
              title="Tributos Cloud"
              icon={<BarChart3 className="h-5 w-5" />}
              data={filteredData}
              field="tributosCloud"
            />
            
            <ChartCard
              title="Liberado CRM"
              icon={<Users className="h-5 w-5" />}
              data={filteredData}
              field="liberadoCrm"
            />
            
            <ChartCard
              title="Migração"
              icon={<PieChart className="h-5 w-5" />}
              data={filteredData}
              field="migracao"
            />
            
            <ChartCard
              title="Ajuste Fórmula"
              icon={<BarChart3 className="h-5 w-5" />}
              data={filteredData}
              field="ajusteFormula"
            />
            
            <ChartCard
              title="Ajuste Relatórios"
              icon={<PieChart className="h-5 w-5" />}
              data={filteredData}
              field="ajusteRelatorios"
            />
            
            <ChartCard
              title="Treinamento"
              icon={<Users className="h-5 w-5" />}
              data={filteredData}
              field="treinamento"
            />
            
            <ChartCard
              title="Virada de Chave"
              icon={<TrendingUp className="h-5 w-5" />}
              data={filteredData}
              field="viradaChave"
            />
          </div>
        </div>
      </div>
    </div>
  );
};