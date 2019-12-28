import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'store';
import { useAsyncCallback } from 'react-async-hook';
import { useTranslation } from 'react-i18next';
import { info } from 'electron-log';

const Counter = () => {
  useEffect(() => info('Rendering Counter component'), []);
  const { t } = useTranslation();
  const { count } = useStoreState(s => s.counter);
  const { increment, decrement, incrementIfOdd, incrementAsync } = useStoreActions(
    a => a.counter,
  );
  const { execute: incrementAsyncCb, loading, error } = useAsyncCallback(() =>
    incrementAsync(),
  );
  const [incrementCb, decrementCb, incrementIfOddCb] = [
    increment,
    decrement,
    incrementIfOdd,
  ].map(x => () => x());

  return <div></div>;
};

export default Counter;
