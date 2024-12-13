import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { SnackbarProvider } from 'notistack';
import CreateLex from '../components/CreateLex.tsx';
import { AuthContext } from '../context/auth-context.tsx';
import { useLexCreateMutation } from '../graphql/lexicon/lexicon.ts';
import { MutationResult } from '@apollo/client';
import ApolloProviderWrapper from '../context/ApolloProviderWrapper.tsx';

vi.mock('../graphql/lexicon/lexicon.ts', () => ({
  useLexCreateMutation: vi.fn()
}));

describe('CreateLex', () => {
  const mockCreateLex = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useLexCreateMutation).mockReturnValue([
      mockCreateLex,
      {
        loading: false
      } as unknown as MutationResult
    ]);
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: vi.fn(), logout: vi.fn(), user: null }}>
        <ApolloProviderWrapper>
          <SnackbarProvider>
            <CreateLex />
          </SnackbarProvider>
        </ApolloProviderWrapper>
      </AuthContext.Provider>
    );

  it('renders the form correctly', () => {
    renderComponent();

    expect(screen.getByLabelText(/lexicon name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('enables the submit button when input is provided', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/lexicon name/i), { target: { value: 'Test Lexicon' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
    });
  });

  it('displays success message on successful lexicon creation', async () => {
    mockCreateLex.mockResolvedValueOnce({ data: { createLex: true } });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/lexicon name/i), { target: { value: 'Test Lexicon' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/lexicon created/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failed lexicon creation', async () => {
    mockCreateLex.mockRejectedValueOnce(new Error('Network error'));
    renderComponent();

    fireEvent.change(screen.getByLabelText(/lexicon name/i), { target: { value: 'Test Lexicon' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/error creating lexicon/i)).toBeInTheDocument();
    });
  });
});
