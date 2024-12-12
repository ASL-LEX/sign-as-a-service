import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/auth-context.tsx';
import NavBar from '../components/NavBar.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('NavBar', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (path = '/') =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <AuthContext.Provider value={{ login: vi.fn(), logout: mockLogout, user: null }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it('renders properly', () => {
    renderComponent();

    expect(screen.getByText(/view lexicon/i)).toBeInTheDocument();
    expect(screen.getByText(/create lexicon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/logout/i)).toBeInTheDocument();
  });

  it('navigates when buttons are clicked', async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/view lexicon/i));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    fireEvent.click(screen.getByText(/create lexicon/i));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/create');
    });
  });

  it('logs out when the logout icon is clicked', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText(/logout/i));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('hides the navbar on the login page', () => {
    renderComponent('/login');
    expect(screen.queryByText(/view lexicon/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/create lexicon/i)).not.toBeInTheDocument();
  });
});
