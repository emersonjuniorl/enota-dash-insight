import { useState, useEffect } from 'react';

export interface MunicipioData {
  id: number;
  database: string;
  entidade: string;
  municipio: string;
  uf: string;
  proprietario: string;
  chamado: string;
  migracao: string;
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

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ptMZq6MiimsIEkIEShb7XY4TNQJmQpIQZlcEnshZJ7o/export?format=csv&gid=0';

function parseCSV(csv: string): MunicipioData[] {
  const lines = csv.split('\n');
  const data: MunicipioData[] = [];
  
  // Skip the first 3 lines (header rows)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV considering quotes and commas
    const columns = parseCSVLine(line);
    if (columns.length < 18) continue;
    
    const item: MunicipioData = {
      id: i - 2,
      database: columns[0] || '',
      entidade: columns[1] || '',
      municipio: columns[2] || '',
      uf: columns[3] || '',
      proprietario: columns[4] || '',
      chamado: columns[5] || '',
      migracao: columns[6] || '',
      ajusteFormula: columns[7] || '',
      ajusteRelatorios: columns[8] || '',
      configuracoes: columns[9] || '',
      treinamento: columns[10] || '',
      viradaChave: columns[11] || '',
      tributosCloud: columns[12] || '',
      liberadoCrm: columns[13] || '',
      statusImplantacao: columns[14] || '',
      chamadoImplantacao: columns[15] || '',
      dataVirada: columns[16] || '',
      observacoes: columns[17] || ''
    };
    
    // Only add rows with valid municipio data
    if (item.municipio) {
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