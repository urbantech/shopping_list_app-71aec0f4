import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemCreation from '../components/ItemCreation';

describe('ItemCreation Component', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    render(<ItemCreation />);
    const container = screen.getByTestId('item_creation-container');
    expect(container).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter item name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve({ success: true }) });
    render(<ItemCreation />);
    userEvent.type(screen.getByPlaceholderText(/enter item name/i), 'Milk');
    userEvent.click(screen.getByRole('button', { name: /add item/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(
      'https://api.ainative.studio/api/v1/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Milk' })
      })
    ));
    expect(screen.getByText(/item added successfully/i)).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 200)));
    render(<ItemCreation />);
    userEvent.type(screen.getByPlaceholderText(/enter item name/i), 'Bread');
    userEvent.click(screen.getByRole('button', { name: /add item/i }));
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));
    render(<ItemCreation />);
    userEvent.type(screen.getByPlaceholderText(/enter item name/i), 'Eggs');
    userEvent.click(screen.getByRole('button', { name: /add item/i }));
    await waitFor(() => expect(screen.getByText(/failed to add item/i)).toBeInTheDocument());
  });

  it('is accessible', () => {
    render(<ItemCreation />);
    const container = screen.getByTestId('item_creation-container');
    expect(container).toHaveAccessibleName(/create new item/i);
    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByRole('button', { name: /add item/i })).toBeEnabled();
  });
});