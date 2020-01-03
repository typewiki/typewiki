import React from 'react';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react/cleanup-after-each';
import Routes, { HOME, COUNTER } from './Routes';

describe('App container', () => {
  const renderComponent = (route: string) => {
    const routes = (
      <MemoryRouter initialEntries={[route]}>
        <Routes />
      </MemoryRouter>
    );

    return render(routes);
  };

  it('should render the revisions page', () => {
    const { getByTestId } = renderComponent(HOME);
    expect(getByTestId('me-btn')).toHaveTextContent('revisions.me-btn');
  });

  it('should render the counter page', () => {
    const { getByTestId } = renderComponent(COUNTER);
    expect(getByTestId('counter')).toHaveTextContent('0');
  });
});
