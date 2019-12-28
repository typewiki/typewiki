import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';

import Routes from './Routes';
import { warn } from 'electron-log';

const App: React.FC = () => {
  useEffect(() => warn('Rendering App component'), []);
  return <Routes />;
};

export default hot(App);
