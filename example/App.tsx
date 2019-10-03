import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import blob from '../src';

const App = () => {
  useEffect(() => {
    alert(blob);
  }, []);
  return (
    <div>
      <h1>Blob examples</h1>
      <p>Hang in there.. examples and docs are coming!</p>
    </div>
  );
}

export default hot(App);