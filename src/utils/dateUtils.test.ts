import { describe, test, expect } from 'vitest';

// Helper function to safely parse date string without timezone issues
const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

// Helper function to format date without timezone issues
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString();
};

describe('Date Utilities', () => {
  test('parseDate should handle date strings correctly without timezone issues', () => {
    const dateString = '2025-05-29';
    const parsedDate = parseDate(dateString);
    
    expect(parsedDate.getFullYear()).toBe(2025);
    expect(parsedDate.getMonth()).toBe(4); // May is month 4 (0-indexed)
    expect(parsedDate.getDate()).toBe(29);
  });

  test('formatDate should display the same date that was input', () => {
    const dateString = '2025-05-29';
    const formatted = formatDate(dateString);
    
    // The formatted date should contain the same day (29)
    // regardless of timezone
    expect(formatted).toContain('29');
    expect(formatted).toContain('2025');
  });

  test('parseDate should work correctly for different dates', () => {
    const testCases = [
      { input: '2025-01-01', expectedYear: 2025, expectedMonth: 0, expectedDay: 1 },
      { input: '2025-12-31', expectedYear: 2025, expectedMonth: 11, expectedDay: 31 },
      { input: '2024-02-29', expectedYear: 2024, expectedMonth: 1, expectedDay: 29 }, // leap year
    ];

    testCases.forEach(({ input, expectedYear, expectedMonth, expectedDay }) => {
      const parsedDate = parseDate(input);
      expect(parsedDate.getFullYear()).toBe(expectedYear);
      expect(parsedDate.getMonth()).toBe(expectedMonth);
      expect(parsedDate.getDate()).toBe(expectedDay);
    });
  });

  test('date comparison should work correctly', () => {
    const date1 = parseDate('2025-05-28');
    const date2 = parseDate('2025-05-29');
    const date3 = parseDate('2025-05-30');

    expect(date1.getTime()).toBeLessThan(date2.getTime());
    expect(date2.getTime()).toBeLessThan(date3.getTime());
  });

  test('should handle edge cases around timezone boundaries', () => {
    // Test dates that commonly cause timezone issues
    const problematicDates = [
      '2025-05-29', // The specific date mentioned in the issue
      '2025-01-01', // New Year's Day
      '2025-12-31', // New Year's Eve
    ];

    problematicDates.forEach(dateString => {
      const parsedDate = parseDate(dateString);
      const [expectedYear, expectedMonth, expectedDay] = dateString.split('-').map(Number);
      
      expect(parsedDate.getFullYear()).toBe(expectedYear);
      expect(parsedDate.getMonth()).toBe(expectedMonth - 1); // month is 0-indexed
      expect(parsedDate.getDate()).toBe(expectedDay);
    });
  });
}); 