import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../api/client', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

import apiClient from '../../api/client';
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../../services/medicineService';

describe('medicineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMedicines fetches data with params', async () => {
    const mockData = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getMedicines({ name: 'test', page: '1' });

    expect(apiClient.get).toHaveBeenCalledWith('/medicines', {
      params: { name: 'test', page: '1' },
    });
    expect(result).toEqual(mockData);
  });

  it('getMedicineById fetches single medicine', async () => {
    const mockMedicine = { id: 1, name: 'Test' };
    (apiClient.get as any).mockResolvedValue({ data: mockMedicine });

    const result = await getMedicineById(1);

    expect(apiClient.get).toHaveBeenCalledWith('/medicines/1/');
    expect(result).toEqual(mockMedicine);
  });

  it('createMedicine sends POST request', async () => {
    const mockNew = { id: 1, name: 'New' };
    (apiClient.post as any).mockResolvedValue({ data: mockNew });

    const result = await createMedicine({
      name: 'New',
      form: 'tablets',
      expiry_date: '2025-01-01',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/medicines/', expect.any(Object));
    expect(result).toEqual(mockNew);
  });

  it('deleteMedicine sends DELETE request', async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await deleteMedicine(1);

    expect(apiClient.delete).toHaveBeenCalledWith('/medicines/1');
  });
});