import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';

vi.mock('../../api/axios', () => ({
  default: { defaults: { headers: { common: {} } } },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useLanguage', () => {
  test('locale par défaut est ru', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.locale).toBe('ru');
    expect(result.current.isRussian).toBe(true);
  });

  test('toggleLanguage passe à en', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.locale).toBe('en');
    expect(result.current.isRussian).toBe(false);
  });

  test('double toggleLanguage revient à ru', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => { result.current.toggleLanguage(); });
    act(() => { result.current.toggleLanguage(); });
    expect(result.current.locale).toBe('ru');
  });

  test('persiste la langue dans localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => { result.current.toggleLanguage(); });
    expect(localStorage.getItem('fc_lang')).toBe('en');
  });
});
