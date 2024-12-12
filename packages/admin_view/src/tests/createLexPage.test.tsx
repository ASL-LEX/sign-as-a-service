import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import CreateLexPage from '../pages/CreateLexPage.tsx';
import ApolloProviderWrapper from '../context/ApolloProviderWrapper.tsx';
import { AuthContext } from '../context/auth-context.tsx';

describe('CreateLexPage', () => {
  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: vi.fn(), logout: vi.fn(), user: null }}>
        <ApolloProviderWrapper>
          <CreateLexPage />
        </ApolloProviderWrapper>
      </AuthContext.Provider>
    );

  it('renders the page correctly', () => {
    renderComponent();
    expect(screen.getByTestId('create-lex-title')).toBeInTheDocument();
    expect(screen.getByTestId('create-lex-title')).toHaveTextContent('Create Lexicon');
    expect(screen.getByLabelText('Lexicon name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
