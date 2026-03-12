/**
 * main.jsx
 * Application entry point. Mounts the React app into the #root div in index.html.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

console.log('[Main] The Next Stamp AI Travel Quiz starting up...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
