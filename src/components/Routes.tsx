import React from 'react';
import { Switch, Route, Router } from 'react-router';
import { AppLayout } from './layouts';
import { Revisions } from './revisions';
import { Counter } from './counter';

import { createBrowserHistory } from 'history';
import CategoryTree from './category-tree/CategoryTree';
const history = createBrowserHistory();

export const HOME = '/';
export const COUNTER = '/counter';

const Routes = () => (
  <AppLayout>
    <Router history={history}>
      <Switch>
        <Route path={COUNTER} component={Counter} />
        <Route path={HOME} component={CategoryTree} />
        <Route path={'/xxx'} component={Revisions} />
      </Switch>
    </Router>
  </AppLayout>
);

export default Routes;
