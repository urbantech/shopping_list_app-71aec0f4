import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ItemDeletion from '../components/ItemDeletion';

describe('ItemDeletion Component', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch.mockReset();
  });

  test('renders correctly', () => {
    render(<ItemDeletion itemId={1} />);
    expect(screen.getByTestId('item_deletion-container')).toBeInTheDocument();
  });

  test('handles user interactions by calling the deletion API', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    render(<ItemDeletion itemId={1} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.ainative.studio/api/v1/items/1',
        {
          method: 'DELETE',
          headers: {
            'X-API-Key': 'your_api_key_here',
          },
        }
      );
    });
  });

  test('shows loading state when API call is in progress', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<ItemDeletion itemId={1} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles API errors and displays an error message', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'));
    render(<ItemDeletion itemId={1} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/error deleting item/i)).toBeInTheDocument();
    });
  });

  test('is accessible and has appropriate ARIA attributes', () => {
    render(<ItemDeletion itemId={1} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    expect(deleteButton).toHaveAttribute('aria-label', 'Delete Item');
  });
});