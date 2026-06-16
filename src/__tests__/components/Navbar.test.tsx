import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const mockToggle = vi.hoisted(() => vi.fn());

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ locale: 'ru', toggleLanguage: mockToggle, isRussian: true }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, isAdmin: false, user: null, logout: vi.fn() }),
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ itemCount: 0 }),
}));

function renderNavbar() {
  return render(<MemoryRouter><Navbar /></MemoryRouter>);
}

describe('Navbar', () => {
  beforeEach(() => {
    mockToggle.mockClear();
  });

  test('affiche les liens de navigation en russe', () => {
    renderNavbar();
    expect(screen.getByText('Главная')).toBeDefined();
    expect(screen.getByText('Клуб')).toBeDefined();
    expect(screen.getByText('Команда')).toBeDefined();
  });

  test('affiche le bouton de langue RU par défaut', () => {
    renderNavbar();
    expect(screen.getByTitle('Язык')).toBeDefined();
    expect(screen.getByTitle('Язык').textContent).toContain('RU');
  });

  test('le clic sur le bouton de langue appelle toggleLanguage', () => {
    renderNavbar();
    fireEvent.click(screen.getByTitle('Язык'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  test('affiche les liens Войти et Регистрация en mode non-connecté', () => {
    renderNavbar();
    expect(screen.getByText('Войти')).toBeDefined();
    expect(screen.getByText('Регистрация')).toBeDefined();
  });
});
