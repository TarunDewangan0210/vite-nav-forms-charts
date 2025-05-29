import type { CheckIn, ChartData } from '../types';

export const processStressData = (checkIns: CheckIn[]): ChartData[] => {
  const dateGroups = checkIns.reduce((acc, checkIn) => {
    const date = checkIn.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(checkIn.stressLevel);
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(dateGroups)
    .map(([date, stressLevels]) => ({
      date,
      value: stressLevels.reduce((sum, level) => sum + level, 0) / stressLevels.length
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const processMoraleData = (checkIns: CheckIn[]): ChartData[] => {
  const dateGroups = checkIns.reduce((acc, checkIn) => {
    const date = checkIn.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(checkIn.moraleLevel);
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(dateGroups)
    .map(([date, moraleLevels]) => ({
      date,
      value: moraleLevels.reduce((sum, level) => sum + level, 0) / moraleLevels.length
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}; 