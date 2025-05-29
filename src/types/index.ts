export interface CheckIn {
  id: string;
  name: string;
  date: string;
  activitiesSince: string;
  activitiesPlanned: string;
  blockers: string;
  stressLevel: number;
  whyStressed?: string;
  moraleLevel: number;
  timestamp: number;
}

export interface ChartData {
  date: string;
  value: number;
}

export type Theme = 'light' | 'dark' | 'blue';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} 