
export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  reminder: boolean;
  type: 'economic' | 'regulatory' | 'project' | 'other';
  relatedAssets?: string[];
}
