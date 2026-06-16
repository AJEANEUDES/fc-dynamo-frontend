import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlayerCard from '../../components/shared/PlayerCard';
import type { Player } from '../../types';

const mockPlayer: Player = {
  id: 'uuid-player-1',
  team_id: 'uuid-team-1',
  first_name: 'Иван',
  last_name: 'Петров',
  position: 'Центральный защитник',
  position_group: 'défenseur',
  jersey_number: 5,
  nationality: 'Россия',
  birth_date: '1995-03-15',
  is_on_loan: false,
};

function renderCard() {
  return render(
    <MemoryRouter>
      <PlayerCard player={mockPlayer} />
    </MemoryRouter>
  );
}

describe('PlayerCard', () => {
  test('affiche le numéro de maillot', () => {
    renderCard();
    expect(screen.getByText('#5')).toBeDefined();
  });

  test('affiche le prénom et nom du joueur', () => {
    renderCard();
    expect(screen.getByText('Иван Петров')).toBeDefined();
  });

  test('affiche la nationalité', () => {
    renderCard();
    expect(screen.getByText('Россия')).toBeDefined();
  });

  test('affiche le libellé de position en russe (Защитник)', () => {
    renderCard();
    expect(screen.getByText('Защитник')).toBeDefined();
  });

  test('le lien pointe vers la fiche du joueur', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('/equipe/uuid-player-1');
  });
});
