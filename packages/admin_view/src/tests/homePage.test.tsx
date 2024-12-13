import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SnackbarProvider } from 'notistack';
import HomePage from '../pages/HomePage.tsx';
import { AuthContext } from '../context/auth-context.tsx';
import ApolloProviderWrapper from '../context/ApolloProviderWrapper.tsx';
import {
  useLexFindAllQuery,
  useGetAllLexEntriesQuery,
  LexFindAllQuery,
  GetAllLexEntriesQuery
} from '../graphql/lexicon/lexicon.ts';
import { QueryResult } from '@apollo/client';
import { Exact } from '../graphql/graphql.ts';

vi.mock('../graphql/lexicon/lexicon.ts', async () => {
  const actual = await vi.importActual('../graphql/lexicon/lexicon.ts');
  return {
    ...actual,
    useLexFindAllQuery: vi.fn(),
    useGetAllLexEntriesQuery: vi.fn()
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useLexFindAllQuery).mockReturnValue({
      data: {
        lexFindAll: [
          { _id: '1', name: 'Test Lexicon 1' },
          { _id: '2', name: 'Test Lexicon 2' }
        ]
      },
      loading: false
    } as unknown as QueryResult<LexFindAllQuery, Exact<{ [key: string]: never }>>);
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: vi.fn(), logout: vi.fn(), user: null }}>
        <ApolloProviderWrapper>
          <SnackbarProvider>
            <HomePage />
          </SnackbarProvider>
        </ApolloProviderWrapper>
      </AuthContext.Provider>
    );

  it('renders the lexicon dropdown', () => {
    renderComponent();

    expect(screen.getByText(/select a lexicon/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders lexicon table', async () => {
    vi.mocked(useGetAllLexEntriesQuery).mockReturnValue({
      data: {
        lexiconAllEntries: []
      },
      loading: false
    } as unknown as QueryResult<GetAllLexEntriesQuery, Exact<{ lexicon: string }>>);

    renderComponent();

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Test Lexicon 1'));

    await waitFor(() => {
      expect(screen.getByTestId('lex-table')).toBeInTheDocument();
    });
  });

  it('does not render the table if no lexicon is selected', () => {
    renderComponent();
    expect(screen.queryByTestId('lex-table')).not.toBeInTheDocument();
  });
});
