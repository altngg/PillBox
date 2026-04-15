import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pillbox } from '../../pages/Pillbox';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../services/medicineService', () => ({
  getMedicines: vi.fn(),
  deleteMedicine: vi.fn(),
}));

import { getMedicines } from '../../services/medicineService';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Pillbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(getMedicines).mockResolvedValue({ items: [] });
    renderWithRouter(<Pillbox />);
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    vi.mocked(getMedicines).mockResolvedValue({ items: [] });
    renderWithRouter(<Pillbox />);

    await waitFor(() => {
      expect(screen.getByText(/Аптечка пуста/i)).toBeInTheDocument();
    });
  });

  it('renders medicines list', async () => {
    const mockMedicines = {
      items: [
        {
          id: 1,
          name: 'Test Medicine',
          form: 'tablets',
          purpose: 'Test',
          expiry_date: '2025-01-01',
          status: 'valid',
        },
      ],
      total: 1,
    };
    vi.mocked(getMedicines).mockResolvedValue(mockMedicines);

    renderWithRouter(<Pillbox />);

    await waitFor(() => {
      expect(screen.getByText('Test Medicine')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    vi.mocked(getMedicines).mockResolvedValue({ items: [] });
    renderWithRouter(<Pillbox />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Название препарата/i)).toBeInTheDocument();
    });
  });
});