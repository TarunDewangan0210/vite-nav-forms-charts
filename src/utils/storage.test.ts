import { describe, test, expect, beforeEach, vi } from 'vitest';
import { getCheckIns, saveCheckIn, updateCheckIn, deleteCheckIn, exportToCSV } from './storage';
import type { CheckIn } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock URL and Blob for CSV export
(globalThis as any).URL = {
  createObjectURL: vi.fn(() => 'mock-url'),
  revokeObjectURL: vi.fn(),
};

(globalThis as any).Blob = vi.fn();

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCheckIn: CheckIn = {
    id: '1',
    name: 'John Doe',
    date: '2025-01-15',
    activitiesSince: 'Completed project setup',
    activitiesPlanned: 'Start development',
    blockers: 'None',
    stressLevel: 2,
    moraleLevel: 4,
    timestamp: Date.now()
  };

  test('should get empty array when no check-ins exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const result = getCheckIns();
    
    expect(result).toEqual([]);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('check-ins');
  });

  test('should save check-in to localStorage', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    
    saveCheckIn(mockCheckIn);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'check-ins',
      JSON.stringify([mockCheckIn])
    );
  });

  test('should update existing check-in', () => {
    const existingCheckIns = [mockCheckIn];
    const updatedCheckIn = { ...mockCheckIn, name: 'Jane Doe', stressLevel: 3 };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCheckIns));
    
    updateCheckIn(updatedCheckIn);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'check-ins',
      JSON.stringify([updatedCheckIn])
    );
  });

  test('should not update if check-in ID not found', () => {
    const existingCheckIns = [mockCheckIn];
    const nonExistentCheckIn = { ...mockCheckIn, id: '999' };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCheckIns));
    
    updateCheckIn(nonExistentCheckIn);
    
    // Should still save the original data unchanged
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  test('should delete check-in by ID', () => {
    const checkIn2 = { ...mockCheckIn, id: '2', name: 'Jane Doe' };
    const existingCheckIns = [mockCheckIn, checkIn2];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCheckIns));
    
    deleteCheckIn('1');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'check-ins',
      JSON.stringify([checkIn2])
    );
  });

  test('should handle delete when ID not found', () => {
    const existingCheckIns = [mockCheckIn];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCheckIns));
    
    deleteCheckIn('999');
    
    // Should save the same data (no changes)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'check-ins',
      JSON.stringify(existingCheckIns)
    );
  });

  test('should export check-ins to CSV', () => {
    // Mock document methods
    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: { visibility: '' }
    };
    
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
    
    exportToCSV([mockCheckIn]);
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
}); 