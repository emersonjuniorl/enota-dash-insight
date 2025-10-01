import { useState, useEffect } from 'react';

export interface MunicipioData {
  id: number;
  database: string;
  entidade: string;
  municipio: string;
  uf: string;
  portfolio: string;
  chamado: string;
  migracao: string;
  conferenciaMigracao: string;
  ajusteFormula: string;
  ajusteRelatorios: string;
  configuracoes: string;
  treinamento: string;
  viradaChave: string;
  tributosCloud: string;
  liberadoCrm: string;
  statusImplantacao: string;
  chamadoImplantacao: string;
  dataVirada: string;
  observacoes: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-whKDk6Tpb4opPTvp6wywAIUDOXWpkhHXF28ZwA8zHA/export?format=csv&gid=1733723722';

function parseCSV(csv: string): MunicipioData[] {
  const lines = csv.split('\n');
  const data: MunicipioData[] = [];
  
  // Skip the first line (header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV considering quotes and commas
    const columns = parseCSVLine(line);
    if (columns.length < 15) continue; // Minimum required columns
    
    const item: MunicipioData = {
      id: i,
      database: columns[0] || '',
      entidade: columns[1] || '',
      municipio: columns[2] || '',
      uf: columns[3] || '',
      portfolio: columns[4] || '',
      chamado: columns[5] || '',
      migracao: columns[6] || '',
      conferenciaMigracao: columns[7] || '',
      ajusteFormula: columns[8] || '',
      ajusteRelatorios: columns[9] || '',
      configuracoes: columns[10] || '',
      treinamento: columns[11] || '',
      viradaChave: columns[12] || '',
      tributosCloud: columns[13] || '',
      liberadoCrm: columns[14] || '',
      statusImplantacao: columns[15] || '',
      chamadoImplantacao: columns[16] || '',
      dataVirada: columns[17] || '',
      observacoes: columns[18] || ''
    };
    
    // Only add rows with valid municipio data
    if (item.municipio && item.municipio !== 'Município') {
      data.push(item);
    }
  }
  
  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export const useGoogleSheetData = () => {
  const [data, setData] = useState<MunicipioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da planilha');
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setData(parsedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
};