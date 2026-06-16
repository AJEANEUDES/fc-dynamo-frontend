import '@testing-library/jest-dom';
import i18n from '../i18n';

beforeEach(async () => {
  await i18n.changeLanguage('ru');
  localStorage.clear();
});
