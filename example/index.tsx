import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootElement = document.createElement('div');

if (!document.querySelector('div')) {
  document.body.appendChild(rootElement);
}

ReactDOM.render(<App />, rootElement);