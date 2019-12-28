import React from 'react';
import { Switch, Route, Router } from 'react-router';
import { AppLayout } from './layouts';
import { Home } from './home';
import { Counter } from './counter';

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export const HOME = '/';
export const COUNTER = '/counter';

const Routes = () => (
  <AppLayout>
    <Router history={history}>
      <Switch>
        <Route path={COUNTER} component={Counter} />
        <Route path={HOME} component={Home} />
      </Switch>
    </Router>
  </AppLayout>
);

export default Routes;
