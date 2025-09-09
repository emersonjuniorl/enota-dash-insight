import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, User, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface KanbanBoardProps {
  data: any[];
}

const statusConfig = {
  "Planejamento": {
    color: "bg-status-pending/10 text-status-pending border-status-pending/20",
    icon: <Clock className="h-4 w-4" />
  },
  "Em Andamento": {
    color: "bg-status-progress/10 text-status-progress border-status-progress/20",
    icon: <AlertCircle className="h-4 w-4" />
  },
  "Concluído": {
    color: "bg-status-completed/10 text-status-completed border-status-completed/20",
    icon: <CheckCircle className="h-4 w-4" />
  },
  "Bloqueado": {
    color: "bg-status-blocked/10 text-status-blocked border-status-blocked/20",
    icon: <XCircle className="h-4 w-4" />
  }
};

export const KanbanBoard = ({ data }: KanbanBoardProps) => {
  const statusColumns = Object.keys(statusConfig);

  const getItemsByStatus = (status: string) => {
    return data.filter(item => item.statusImplantacao === status);
  };

  const KanbanCard = ({ item }: { item: any }) => (
    <Card className="mb-3 bg-dashboard-kanban-card hover:shadow-medium transition-all duration-200 cursor-pointer border border-border/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm text-foreground">{item.municipio}</h4>
            </div>
            <Badge 
              variant="outline"
              className={`text-xs ${statusConfig[item.statusImplantacao as keyof typeof statusConfig]?.color || ''}`}
            >
              {statusConfig[item.statusImplantacao as keyof typeof statusConfig]?.icon}
              <span className="ml-1">{item.statusImplantacao}</span>
            </Badge>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {item.proprietario.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.proprietario}
            </span>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                item.tributosCloud === 'Ativo' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted/10 text-muted-foreground border-muted/20'
              }`}
            >
              Tributos: {item.tributosCloud}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                item.liberadoCrm === 'Sim' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted/10 text-muted-foreground border-muted/20'
              }`}
            >
              CRM: {item.liberadoCrm}
            </Badge>
          </div>

          {/* Progress indicators */}
          <div className="text-xs text-muted-foreground">
            <div className="grid grid-cols-2 gap-1">
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
    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <div className="flex-1 min-w-80">
        <Card className="h-full bg-dashboard-kanban-column border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                {config?.icon}
                <span>{status}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <ScrollArea className="h-[600px] pr-2">
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum município neste status</p>
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building className="h-6 w-6 text-primary" />
          Visão Kanban - Municípios por Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {statusColumns.map((status) => (
            <KanbanColumn key={status} status={status} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};