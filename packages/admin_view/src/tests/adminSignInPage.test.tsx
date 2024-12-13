import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthContext } from '../context/auth-context.tsx';
import AdminSignInPage from '../pages/AdminSignInPage.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe('AdminSignInPage', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SnackbarProvider>
          <AuthContext.Provider value={{ login: mockLogin, logout: vi.fn(), user: null }}>
            <AdminSignInPage />
          </AuthContext.Provider>
        </SnackbarProvider>
      </MemoryRouter>
    );

  it('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('disables login button if fields are empty', async () => {
    renderComponent();

    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeDisabled();
  });

  it('calls login and navigates on successful login', async () => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    mockLogin.mockResolvedValueOnce(true);
    renderComponent();

    const emailInput = screen.getByTestId('email-input').querySelector('input')!;
    const passwordInput = screen.getByTestId('password-input').querySelector('input')!;
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows an error if login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error());
    renderComponent();

    const emailInput = screen.getByTestId('email-input').querySelector('input')!;
    const passwordInput = screen.getByTestId('password-input').querySelector('input')!;
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText(/error logging in/i)).toBeInTheDocument();
    });
  });
});
