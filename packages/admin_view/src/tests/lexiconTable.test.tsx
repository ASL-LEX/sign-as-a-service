import { beforeEach, describe, vi, it, expect } from 'vitest';
import {
  GetAllLexEntriesQuery,
  useGetAllLexEntriesQuery,
  useLexCreateEntryMutation,
  useLexDeleteEntryMutation,
  useLexUpdateEntryMutation
} from '../graphql/lexicon/lexicon.ts';
import { MutationResult, QueryResult } from '@apollo/client';
import { Exact } from '../graphql/graphql.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '../context/auth-context.tsx';
import ApolloProviderWrapper from '../context/ApolloProviderWrapper.tsx';
import LexiconTable from '../components/LexiconTable.tsx';
import { SnackbarProvider } from 'notistack';

vi.mock('../graphql/lexicon/lexicon.ts', async () => {
  const actual = await vi.importActual('../graphql/lexicon/lexicon.ts');
  return {
    ...actual,
    useGetAllLexEntriesQuery: vi.fn(),
    useLexDeleteEntryMutation: vi.fn(),
    useLexCreateEntryMutation: vi.fn(),
    useLexUpdateEntryMutation: vi.fn()
  };
});

describe('LexiconTable', () => {
  const mockUseGetAllLexEntriesQuery = vi.mocked(useGetAllLexEntriesQuery);
  const mockDeleteLexEntry = vi.fn();
  const mockLexCreateEntry = vi.fn();
  const mockLexUpdateEntry = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseGetAllLexEntriesQuery.mockReturnValue({
      data: {
        lexiconAllEntries: [
          {
            __typename: 'LexiconEntry',
            key: 'mock-key',
            primary: 'mock-primary',
            video: 'mock-video-url',
            associates: ['associate1', 'associate2'],
            fields: {
              exampleField1: 'value1'
            }
          }
        ]
      },
      loading: false
    } as unknown as QueryResult<GetAllLexEntriesQuery, Exact<{ lexicon: string }>>);

    mockDeleteLexEntry.mockResolvedValue({ data: { lexiconDeleteEntry: true } });

    vi.mocked(useLexDeleteEntryMutation).mockReturnValue([
      mockDeleteLexEntry,
      {
        loading: false
      } as MutationResult
    ]);

    vi.mocked(useLexCreateEntryMutation).mockReturnValue([
      mockLexCreateEntry,
      {
        loading: false
      } as MutationResult
    ]);

    vi.mocked(useLexUpdateEntryMutation).mockReturnValue([
      mockLexUpdateEntry,
      {
        loading: false
      } as MutationResult
    ]);
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: vi.fn(), logout: vi.fn(), user: null }}>
        <ApolloProviderWrapper>
          <SnackbarProvider>
            <LexiconTable lexiconId="test-lex" loading={false} />
          </SnackbarProvider>
        </ApolloProviderWrapper>
      </AuthContext.Provider>
    );

  it('renders all fields correctly', () => {
    renderComponent();

    expect(screen.getByText(/mock-key/i)).toBeInTheDocument();
    expect(screen.getByText(/mock-primary/i)).toBeInTheDocument();
    expect(screen.getByText(/associate1/i)).toBeInTheDocument();
    expect(screen.getByText(/associate2/i)).toBeInTheDocument();
    expect(screen.getByText(/exampleField1/i)).toBeInTheDocument();
    expect(screen.getByText(/value1/i)).toBeInTheDocument();
    expect(screen.getByTestId('lex-table-video-cell')).toHaveAttribute('src', 'mock-video-url');
    expect(screen.getByLabelText(/edit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete/i)).toBeInTheDocument();
    expect(screen.getByText(/add record/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('renders delete modal', () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/delete/i));

    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    expect(screen.getByTestId('lex-table-delete-modal-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('lex-table-delete-modal-delete-button')).toBeInTheDocument();
  });

  it('closes delete modal', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/delete/i));
    fireEvent.click(screen.getByTestId('lex-table-delete-modal-cancel-button'));

    await waitFor(() => {
      expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
    });
  });

  it('deletes row and closes delete modal', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/delete/i));
    fireEvent.click(screen.getByTestId('lex-table-delete-modal-delete-button'));

    await waitFor(() => {
      expect(mockDeleteLexEntry).toHaveBeenCalled();
      expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
    });
  });

  it('renders edit cells', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/edit/i));

    await waitFor(() => {
      expect(screen.getByTestId('lex-table-associates-edit')).toBeInTheDocument();
      expect(screen.getByTestId('lex-table-fields-edit')).toBeInTheDocument();
      expect(screen.getByTestId('lex-table-save-button')).toBeInTheDocument();
      expect(screen.getByTestId('lex-table-cancel-button')).toBeInTheDocument();
    });
  });

  it('creates new row', async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/add record/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(mockLexCreateEntry).toHaveBeenCalledWith({
        variables: {
          lexEntry: {
            associates: [],
            fields: {
              english: ''
            },
            key: '',
            lexicon: 'test-lex',
            primary: '',
            video: ''
          }
        }
      });
      expect(mockLexUpdateEntry).not.toHaveBeenCalled();
    });
  });

  it('renders error snackbar on row creation failure', async () => {
    renderComponent();

    mockLexCreateEntry.mockResolvedValue({ data: null, errors: [{ message: 'row creation failure' }] });

    fireEvent.click(screen.getByText(/add record/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(screen.queryByText(/row creation failure/i)).toBeInTheDocument();
    });
  });

  it('does not render error snackbar on row creation success', async () => {
    renderComponent();

    mockLexCreateEntry.mockResolvedValue({ data: {}, errors: [{ message: 'row creation failure' }] });

    fireEvent.click(screen.getByText(/add record/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(screen.queryByText(/row creation failure/i)).not.toBeInTheDocument();
    });
  });

  it('updates row', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/edit/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(mockLexUpdateEntry).toHaveBeenCalledWith({
        variables: {
          lexEntry: {
            key: 'mock-key',
            findByKey: 'mock-key',
            lexicon: 'test-lex',
            primary: 'mock-primary',
            video: 'mock-video-url',
            associates: ['associate1', 'associate2'],
            fields: {
              exampleField1: 'value1'
            }
          }
        }
      });
      expect(mockLexCreateEntry).not.toHaveBeenCalled();
    });
  });

  it('renders error snackbar on row update failure', async () => {
    renderComponent();

    mockLexUpdateEntry.mockResolvedValue({ data: null, errors: [{ message: 'row update failure' }] });

    fireEvent.click(screen.getByLabelText(/edit/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(screen.queryByText(/row update failure/i)).toBeInTheDocument();
    });
  });

  it('does not render error snackbar on row update success', async () => {
    renderComponent();

    mockLexUpdateEntry.mockResolvedValue({ data: {}, errors: [{ message: 'row update failure' }] });

    fireEvent.click(screen.getByLabelText(/edit/i));
    fireEvent.click(screen.getByTestId('lex-table-save-button'));

    await waitFor(() => {
      expect(screen.queryByText(/row update failure/i)).not.toBeInTheDocument();
    });
  });
});
