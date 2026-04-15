import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' }),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock('../context/AuthContext', async () => {
  return {
    useAuth: () => ({
      isAuth: true,
      loading: false,
      user: { id: 1, email: 'test@example.com' },
      login: vi.fn(),
      logout: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});