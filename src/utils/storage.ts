import type { CheckIn } from '../types';

const STORAGE_KEY = 'check-ins';

export const getCheckIns = (): CheckIn[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading check-ins from localStorage:', error);
    return [];
  }
};

export const saveCheckIn = (checkIn: CheckIn): void => {
  try {
    const checkIns = getCheckIns();
    checkIns.push(checkIn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
  } catch (error) {
    console.error('Error saving check-in to localStorage:', error);
  }
};

export const exportToCSV = (checkIns: CheckIn[]): void => {
  const headers = [
    'ID',
    'Name',
    'Date',
    'Activities Since',
    'Activities Planned',
    'Blockers',
    'Stress Level',
    'Why Stressed',
    'Morale Level',
    'Timestamp'
  ];

  const csvContent = [
    headers.join(','),
    ...checkIns.map(checkIn => [
      checkIn.id,
      `"${checkIn.name}"`,
      checkIn.date,
      `"${checkIn.activitiesSince}"`,
      `"${checkIn.activitiesPlanned}"`,
      `"${checkIn.blockers}"`,
      checkIn.stressLevel,
      `"${checkIn.whyStressed || ''}"`,
      checkIn.moraleLevel,
      checkIn.timestamp
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `check-ins-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 