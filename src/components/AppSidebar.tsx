import { Filter } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FiltersSidebar } from "./FiltersSidebar";
import { FilterState } from "./Dashboard";
import { MunicipioData } from "@/hooks/useGoogleSheetData";

interface AppSidebarProps {
  data: MunicipioData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function AppSidebar({ data, filters, onFiltersChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border bg-sidebar-background">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-sidebar-primary" />
            <h2 className="font-semibold text-sidebar-foreground">Filtros</h2>
          </div>
          <SidebarTrigger className="md:hidden" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-0">
        <FiltersSidebar 
          data={data} 
          filters={filters} 
          onFiltersChange={onFiltersChange}
        />
      </SidebarContent>
    </Sidebar>
  );
}