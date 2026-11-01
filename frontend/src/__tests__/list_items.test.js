import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListItems from '../components/ListItems';

describe('ListItems Component', () => {
  const mockItems = [
    { id: 1, name: 'Milk', checked: false },
    { id: 2, name: 'Bread', checked: true },
  ];

  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('renders correctly when items are fetched successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockItems),
    });

    render(<ListItems />);

    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching items', () => {
    global.fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve(), 100))
    );

    render(<ListItems />);

    expect(screen.getByTestId('list_items-container')).toHaveTextContent('Loading...');
  });

  test('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<ListItems />);

    await waitFor(() => {
      expect(screen.getByTestId('list_items-container')).toHaveTextContent('Error loading items.');
    });
  });

  test('toggles item checked state on click', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockItems),
    });

    render(<ListItems />);

    await waitFor(() => {
      expect(screen.getByText('Milk').closest('label').querySelector('input')).not.toBeChecked();
      expect(screen.getByText('Bread').closest('label').querySelector('input')).toBeChecked();
    });

    userEvent.click(screen.getByText('Milk').closest('label'));

    await waitFor(() => {
      expect(screen.getByText('Milk').closest('label').querySelector('input')).toBeChecked();
    });
  });

  test('is accessible', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockItems),
    });

    render(<ListItems />);

    await waitFor(() => {
      expect(screen.getByText('Milk')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByText('Bread')).toHaveAttribute('aria-checked', 'true');
    });
  });
});