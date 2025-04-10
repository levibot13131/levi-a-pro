
import { toast } from "sonner";
import { FinancialDataSource } from '@/types/marketInformation';
import { INFORMATION_SOURCES } from './mockData';

export const getInformationSources = async (): Promise<FinancialDataSource[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(INFORMATION_SOURCES), 600);
  });
};

export const toggleSourceFocus = async (sourceId: string, focused: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const source = INFORMATION_SOURCES.find(s => s.id === sourceId);
  if (source) {
    source.focused = focused;
    toast.success(`${source.name} ${focused ? 'added to' : 'removed from'} focused sources`);
  }
};
