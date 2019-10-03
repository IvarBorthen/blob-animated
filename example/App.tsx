import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import blob from '../src';

const App = () => {
  useEffect(() => {
    console.log('???');
    console.log(blob);
  }, []);
  return (
    <div>
      <h1>hello example?</h1>
    </div>
  );
}

export default hot(App);