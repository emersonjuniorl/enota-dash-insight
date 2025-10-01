import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FilterState } from "./Dashboard";
import { MunicipioData } from "@/hooks/useGoogleSheetData";

interface FiltersSidebarProps {
  data: MunicipioData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const FiltersSidebar = ({ data, filters, onFiltersChange }: FiltersSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    municipios: true,
    proprietarios: true,
    portfolios: true,
    statusImplantacao: true,
    tributosCloud: true,
    liberadoCrm: true,
  });

  // Extract unique values for each filter
  const uniqueValues = {
    municipios: [...new Set(data.map(item => item.municipio))].sort(),
    proprietarios: [...new Set(data.map(item => item.proprietario))].sort(),
    portfolios: [...new Set(data.map(item => item.portfolio))].sort(),
    statusImplantacao: [...new Set(data.map(item => item.statusImplantacao))].sort(),
    tributosCloud: [...new Set(data.map(item => item.tributosCloud))].sort(),
    liberadoCrm: [...new Set(data.map(item => item.liberadoCrm))].sort(),
  };

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    }
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      municipios: [],
      proprietarios: [],
      portfolios: [],
      statusImplantacao: [],
      tributosCloud: [],
      liberadoCrm: []
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  };

  const FilterSection = ({ 
    title, 
    category, 
    values 
  }: { 
    title: string; 
    category: keyof FilterState; 
    values: string[] 
  }) => (
    <Collapsible 
      open={expandedSections[category]} 
      onOpenChange={() => toggleSection(category)}
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-3 h-auto font-medium text-sm"
        >
          <div className="flex items-center gap-2">
            <span>{title}</span>
            {filters[category].length > 0 && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                {filters[category].length}
              </Badge>
            )}
          </div>
          {expandedSections[category] ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-2">
          <ScrollArea className="max-h-60 overflow-y-auto">
            <div className="space-y-2 pr-4">
              {values.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${category}-${value}`}
                    checked={filters[category].includes(value)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(category, value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`${category}-${value}`}
                    className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                  >
                    {value}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="h-full bg-sidebar-background">
      <div className="p-4 border-b border-sidebar-border">
        {getActiveFiltersCount() > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="w-full justify-center gap-2 text-xs"
          >
            <X className="h-3 w-3" />
            Limpar Filtros ({getActiveFiltersCount()})
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 space-y-1">
          <FilterSection
            title="Município"
            category="municipios"
            values={uniqueValues.municipios}
          />
          
          <Separator className="my-2" />
          
          <FilterSection
            title="Proprietário"
            category="proprietarios"
            values={uniqueValues.proprietarios}
          />
          
          <Separator className="my-2" />
          
          <FilterSection
            title="Portfólio"
            category="portfolios"
            values={uniqueValues.portfolios}
          />
          
          <Separator className="my-2" />
          
          <FilterSection
            title="Status Implantação"
            category="statusImplantacao"
            values={uniqueValues.statusImplantacao}
          />
          
          <Separator className="my-2" />
          
          <FilterSection
            title="Tributos Cloud"
            category="tributosCloud"
            values={uniqueValues.tributosCloud}
          />
          
          <Separator className="my-2" />
          
          <FilterSection
            title="Liberado CRM"
            category="liberadoCrm"
            values={uniqueValues.liberadoCrm}
          />
        </div>
      </ScrollArea>
    </div>
  );
};