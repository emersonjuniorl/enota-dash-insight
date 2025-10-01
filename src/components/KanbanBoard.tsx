import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, User, Clock, CheckCircle, AlertCircle, XCircle, PlayCircle } from "lucide-react";
import { MunicipioData } from "@/hooks/useGoogleSheetData";

interface KanbanBoardProps {
  data: MunicipioData[];
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Não iniciada":
      return {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        icon: <Clock className="h-4 w-4" />
      };
    case "Em execução":
      return {
        color: "bg-warning/10 text-warning border-warning/20",
        icon: <PlayCircle className="h-4 w-4" />
      };
    case "Em Conferência":
      return {
        color: "bg-info/10 text-info border-info/20",
        icon: <AlertCircle className="h-4 w-4" />
      };
    case "Bloqueada":
      return {
        color: "bg-destructive/10 text-destructive border-destructive/20",
        icon: <XCircle className="h-4 w-4" />
      };
    case "Aguardando Virada":
      return {
        color: "bg-purple/10 text-purple border-purple/20",
        icon: <Clock className="h-4 w-4" />
      };
    case "Operação Assistida":
      return {
        color: "bg-cyan/10 text-cyan border-cyan/20",
        icon: <AlertCircle className="h-4 w-4" />
      };
    case "Concluída":
      return {
        color: "bg-success/10 text-success border-success/20",
        icon: <CheckCircle className="h-4 w-4" />
      };
    case "Não se Aplica":
      return {
        color: "bg-muted/10 text-muted-foreground border-muted/20",
        icon: <XCircle className="h-4 w-4" />
      };
    default:
      return {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        icon: <Clock className="h-4 w-4" />
      };
  }
};

export const KanbanBoard = ({ data }: KanbanBoardProps) => {
  // Define the specific order for Kanban columns
  const statusOrder = [
    "Não iniciada",
    "Em execução", 
    "Bloqueada",
    "Aguardando Virada",
    "Operação Assistida",
    "Concluída"
  ];
  
  // Get unique statuses from data and order them according to statusOrder
  const allStatuses = [...new Set(data.map(item => item.statusImplantacao).filter(Boolean))];
  const statusColumns = statusOrder.filter(status => allStatuses.includes(status))
    .concat(allStatuses.filter(status => !statusOrder.includes(status)));

  const getItemsByStatus = (status: string) => {
    return data.filter(item => item.statusImplantacao === status);
  };

  const KanbanCard = ({ item }: { item: MunicipioData }) => (
    <Card className="mb-2 md:mb-3 bg-dashboard-kanban-card hover:shadow-medium transition-all duration-200 cursor-pointer border border-border/50">
      <CardContent className="p-3 md:p-4">
        <div className="space-y-2 md:space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <h4 className="font-semibold text-xs md:text-sm text-foreground">{item.municipio}</h4>
            </div>
            <Badge 
              variant="outline"
              className={`text-[10px] md:text-xs ${getStatusConfig(item.statusImplantacao).color}`}
            >
              {getStatusConfig(item.statusImplantacao).icon}
              <span className="ml-1 hidden md:inline">{item.statusImplantacao}</span>
            </Badge>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 md:h-6 md:w-6">
              <AvatarFallback className="text-[10px] md:text-xs bg-primary/10 text-primary">
                {item.portfolio.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-2 w-2 md:h-3 md:w-3" />
              {item.portfolio}
            </span>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant="outline" 
              className={`text-[10px] md:text-xs ${
                item.tributosCloud === 'Implantado' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted/10 text-muted-foreground border-muted/20'
              }`}
            >
              <span className="hidden md:inline">Tributos: </span>{item.tributosCloud}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-[10px] md:text-xs ${
                item.liberadoCrm === 'Liberado' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted/10 text-muted-foreground border-muted/20'
              }`}
            >
              <span className="hidden md:inline">CRM: </span>{item.liberadoCrm}
            </Badge>
          </div>

          {/* Progress indicators */}
          <div className="text-[10px] md:text-xs text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <span>Migração: {item.migracao}</span>
              <span>Treinamento: {item.treinamento}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ status }: { status: string }) => {
    const items = getItemsByStatus(status);
    const config = getStatusConfig(status);

    return (
      <div className="flex-1 min-w-60 md:min-w-80">
        <Card className="h-full bg-dashboard-kanban-column border-border/50">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="flex items-center justify-between text-sm md:text-base">
              <div className="flex items-center gap-1 md:gap-2">
                {config.icon}
                <span className="truncate">{status}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                {items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <ScrollArea className="h-[400px] md:h-[600px] pr-2">
              {items.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <Building className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs md:text-sm">Nenhum município neste status</p>
                </div>
              ) : (
                items.map((item) => (
                  <KanbanCard key={item.id} item={item} />
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-card shadow-soft border-0">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Building className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <span className="text-sm md:text-xl">Visão Kanban - Municípios por Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4">
          {statusColumns.map((status) => (
            <KanbanColumn key={status} status={status} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};