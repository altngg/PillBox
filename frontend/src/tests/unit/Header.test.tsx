import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../../components/Header';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Header', () => {
  it('renders home link with logo', () => {
    renderWithRouter(<Header />);
    const homeLink = screen.getByRole('link', { name: /домой/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders profile icon', () => {
    renderWithRouter(<Header />);
    const profileIcon = screen.getByAltText(/профиль/i);
    expect(profileIcon).toBeInTheDocument();
  });

  it('has header container', () => {
    const { container } = renderWithRouter(<Header />);
    const headerContainer = container.querySelector('.header-container');
    expect(headerContainer).toBeInTheDocument();
  });
});