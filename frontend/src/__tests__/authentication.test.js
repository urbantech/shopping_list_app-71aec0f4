import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

describe('Authentication Component', () => {
  const mockFetch = global.fetch;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it('renders correctly', () => {
    render(<Authentication />);
    expect(screen.getByTestId('authentication-container')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('handles user login interaction', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ success: true, token: 'fake-token' }),
      ok: true,
    });

    render(<Authentication />);
    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.ainative.studio/api/v1/auth/login',
        expect.any(Object)
      );
    });
  });

  it('handles user registration interaction', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ success: true, token: 'fake-token' }),
      ok: true,
    });

    render(<Authentication />);
    userEvent.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'newpassword123');
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.ainative.studio/api/v1/auth/register',
        expect.any(Object)
      );
    });
  });

  it('shows loading state during API call', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 500)));

    render(<Authentication />);
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' }),
      ok: false,
    });

    render(<Authentication />);
    userEvent.type(screen.getByLabelText(/email/i), 'invalid@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('is accessible', () => {
    render(<Authentication />);
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleName(/email/i);
    expect(screen.getByLabelText(/password/i)).toHaveAccessibleName(/password/i);
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /register/i })).toBeEnabled();
  });
});