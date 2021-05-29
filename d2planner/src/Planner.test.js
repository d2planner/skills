import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Planner from './Planner'

describe('<Planner />', () => {
  it('renders character buttons', () => {
    render(<Planner />);
    expect(screen.getByText('barbarian')).toBeInTheDocument();
    expect(screen.getByText('sorceress')).toBeInTheDocument();
    expect(screen.getByText('druid')).toBeInTheDocument();
  });
  it('renders default (amazon) tabs', () => {
    render(<Planner />);
    expect(screen.getByText('Bow and Crossbow')).toBeInTheDocument();
    expect(screen.getByText('Passive and Magic')).toBeInTheDocument();
    expect(screen.getByText('Javelin and Spear')).toBeInTheDocument();
  });
});
