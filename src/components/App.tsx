import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';

import Routes from './Routes';
import { warn } from 'electron-log';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

import './App.scss';

// import '@blueprintjs/core/lib/css/blueprint.css';
// import '@blueprintjs/icons/lib/css/blueprint-icons.css';

// setup your `RestLink` with your endpoint
const restLink = new RestLink({
  endpoints: { ru: 'https://ru.wikipedia.org/w/api.php' },
});

// setup your client
const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  useEffect(() => warn('Rendering App component'), []);
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
};

export default hot(App);
