import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

const mockFetch = global.fetch;

describe('ItemCheckOff Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  const ItemCheckOff = ({ itemId, isChecked }) => (
    <div data-testid="item_check_off-container">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {}}
        aria-label={`check-off-item-${itemId}`}
      />
    </div>
  );

  test('renders correctly', () => {
    render(<ItemCheckOff itemId={1} isChecked={false} />);
    const container = screen.getByTestId('item_check_off-container');
    expect(container).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox', { name: /check-off-item-1/i });
    expect(checkbox).not.toBeChecked();
  });

  test('handles user interactions', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    render(<ItemCheckOff itemId={1} isChecked={false} />);
    const checkbox = screen.getByRole('checkbox', { name: /check-off-item-1/i });

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.ainative.studio/some-endpoint-to-check-off-item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'your-api-key',
          },
          body: JSON.stringify({ itemId: 1, isChecked: true }),
        }
      );
    });
  });

  test('shows loading state when checking off an item', async () => {
    mockFetch.mockImplementation(() =>
      new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ItemCheckOff itemId={1} isChecked={false} />);
    const checkbox = screen.getByRole('checkbox', { name: /check-off-item-1/i });

    await userEvent.click(checkbox);

    expect(checkbox).toBeDisabled();

    await waitFor(() => {
      expect(checkbox).toBeEnabled();
    });
  });

  test('handles API errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Failed to check off item' }),
    });

    render(<ItemCheckOff itemId={1} isChecked={false} />);
    const checkbox = screen.getByRole('checkbox', { name: /check-off-item-1/i });

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const errorAlert = screen.getByText(/failed to check off item/i);
      expect(errorAlert).toBeInTheDocument();
    });
  });

  test('is accessible', () => {
    render(<ItemCheckOff itemId={1} isChecked={false} />);
    const checkbox = screen.getByRole('checkbox', { name: /check-off-item-1/i });
    expect(checkbox).toHaveAttribute('aria-label', 'check-off-item-1');
  });
});