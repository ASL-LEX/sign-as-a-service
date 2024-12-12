import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { Banner } from './components/Banner.component';
import { ThemeProvider } from './theme/Theme.provider';
import App from './App';
import React from 'react';

vi.mock('@bu-sail/saas-view', () => ({
  Search: ({ value, setValue }: { value: any; setValue: (val: any) => void }) => (
    <div>
      <input
        data-testid="search-input"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
    </div>
  ),
}));

vi.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ApolloClient: vi.fn(),
  InMemoryCache: vi.fn(),
}));

describe('Banner Component', () => {
  it('renders two InfoCards with correct content', () => {
    render(
      <ThemeProvider>
        <Banner />
      </ThemeProvider>
    );

    const infoCards = screen.getAllByRole('region'); 
    expect(infoCards).toHaveLength(2);
    expect(infoCards[0]).toHaveTextContent('Text Placeholder');
    expect(infoCards[1]).toHaveTextContent('Video Placeholder');
  });

  it('applies theme styles correctly', () => {
    render(
      <ThemeProvider>
        <Banner />
      </ThemeProvider>
    );

    const banner = screen.getByTestId('banner-container');
    expect(banner).toHaveStyle('background-color: var(--theme-primary-main)');
  });
});

describe('ThemeProvider', () => {
  it('renders children with a default theme', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
  });
});

describe('App Component', () => {
  it('renders the Banner and Search components', () => {
    render(<App />);

    const banner = screen.getByText('Text Placeholder');
    const searchInput = screen.getByTestId('search-input');

    expect(banner).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    render(<App />);

    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'New Search Term' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('New Search Term');
    });
  });
});