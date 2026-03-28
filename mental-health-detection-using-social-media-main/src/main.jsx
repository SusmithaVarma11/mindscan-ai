import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css'; // MUST BE 'style.css' to fix the design

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);