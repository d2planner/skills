import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Planner from './Planner'

describe('<Planner />', () => {
  it('renders character buttons', () => {
    const  history = createBrowserHistory();
    render(<Router history={history}><Planner /></Router>);
    expect(screen.getByText('barbarian')).toBeInTheDocument();
    expect(screen.getByText('sorceress')).toBeInTheDocument();
    expect(screen.getByText('druid')).toBeInTheDocument();
  });
  it('renders default (sorceress) tabs', () => {
    const  history = createBrowserHistory();
    render(<Router history={history}><Planner /></Router>);
    expect(screen.getByText('Fire Spells')).toBeInTheDocument();
    expect(screen.getByText('Cold Spells')).toBeInTheDocument();
    expect(screen.getByText('Lightning Spells')).toBeInTheDocument();
  });
});
