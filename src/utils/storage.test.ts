import { describe, test, expect, beforeEach } from 'vitest';
import { getCheckIns, saveCheckIn } from './storage';
import type { CheckIn } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => {
    return localStorageMock.store[key] || null;
  },
  setItem: (key: string, value: string) => {
    localStorageMock.store[key] = value;
  },
  clear: () => {
    localStorageMock.store = {};
  },
  store: {} as Record<string, string>
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('getCheckIns returns empty array when no data', () => {
    const checkIns = getCheckIns();
    expect(checkIns).toEqual([]);
  });

  test('saveCheckIn stores check-in data', () => {
    const checkIn: CheckIn = {
      id: '1',
      name: 'Test User',
      date: '2024-01-01',
      activitiesSince: 'Working on tests',
      activitiesPlanned: 'More testing',
      blockers: 'None',
      stressLevel: 3,
      moraleLevel: 4,
      timestamp: Date.now()
    };

    saveCheckIn(checkIn);
    const checkIns = getCheckIns();
    
    expect(checkIns).toHaveLength(1);
    expect(checkIns[0]).toEqual(checkIn);
  });

  test('multiple check-ins are stored correctly', () => {
    const checkIn1: CheckIn = {
      id: '1',
      name: 'User 1',
      date: '2024-01-01',
      activitiesSince: 'Task 1',
      activitiesPlanned: 'Task 2',
      blockers: 'None',
      stressLevel: 2,
      moraleLevel: 5,
      timestamp: Date.now()
    };

    const checkIn2: CheckIn = {
      id: '2',
      name: 'User 2',
      date: '2024-01-02',
      activitiesSince: 'Task 3',
      activitiesPlanned: 'Task 4',
      blockers: 'Blocked',
      stressLevel: 4,
      moraleLevel: 3,
      timestamp: Date.now()
    };

    saveCheckIn(checkIn1);
    saveCheckIn(checkIn2);
    
    const checkIns = getCheckIns();
    expect(checkIns).toHaveLength(2);
    expect(checkIns[0]).toEqual(checkIn1);
    expect(checkIns[1]).toEqual(checkIn2);
  });
}); 