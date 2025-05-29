import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import Navigation from './Navigation';
import { describe, test, expect } from 'vitest';
import { act } from '@testing-library/react';

const NavigationWrapper = () => (
  <BrowserRouter>
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  </BrowserRouter>
);

describe('Navigation', () => {
  test('renders navigation component', () => {
    const { container } = render(<NavigationWrapper />);
    expect(container.querySelector('.navigation')).toBeTruthy();
  });

  test('renders navigation brand', () => {
    const { getByText } = render(<NavigationWrapper />);
    expect(getByText('Check-in App')).toBeTruthy();
  });

  test('renders all navigation links', () => {
    const { getByText } = render(<NavigationWrapper />);
    expect(getByText('Check-in Table')).toBeTruthy();
    expect(getByText('Check-in Form')).toBeTruthy();
    expect(getByText('Dashboard')).toBeTruthy();
  });

  test('renders theme selector', () => {
    const { getByLabelText } = render(<NavigationWrapper />);
    expect(getByLabelText('Theme:')).toBeTruthy();
    expect(getByLabelText('Theme:')).toHaveValue('light');
  });

  test('can change theme', () => {
    const { getByLabelText } = render(<NavigationWrapper />);
    const themeSelect = getByLabelText('Theme:');
    
    act(() => {
      fireEvent.change(themeSelect, { target: { value: 'dark' } });
    });
    expect(themeSelect).toHaveValue('dark');
  });

  test('mobile menu toggle works', () => {
    const { getByLabelText } = render(<NavigationWrapper />);
    const toggleButton = getByLabelText('Toggle navigation menu');
    
    const navMenu = document.querySelector('.nav-menu');
    expect(navMenu).not.toHaveClass('nav-menu-open');
    
    act(() => {
      fireEvent.click(toggleButton);
    });
    
    expect(navMenu).toHaveClass('nav-menu-open');
  });
}); 