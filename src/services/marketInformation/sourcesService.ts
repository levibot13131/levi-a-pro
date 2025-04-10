
import { toast } from "sonner";
import { FinancialDataSource } from '@/types/marketInformation';
import { FINANCIAL_SOURCES } from './mockData';

export const getInformationSources = async (): Promise<FinancialDataSource[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(FINANCIAL_SOURCES), 500);
  });
};

export const toggleSourceFocus = async (sourceId: string, focused: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const source = FINANCIAL_SOURCES.find(s => s.id === sourceId);
  if (source) {
    source.focused = focused;
    toast.success(`${source.name} ${focused ? 'added to' : 'removed from'} focused sources`);
  }
};

// Function to add custom source
export const addCustomSource = async (source: Omit<FinancialDataSource, 'id'>): Promise<FinancialDataSource> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newSource: FinancialDataSource = {
    ...source,
    id: `source-custom-${Date.now()}`
  };
  FINANCIAL_SOURCES.push(newSource);
  toast.success(`Added new source: ${newSource.name}`);
  return newSource;
};
