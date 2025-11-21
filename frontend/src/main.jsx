import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/DashUI-1.0.0/styles/theme.css';
import './styles.css'
import { LoadingBarContainer } from 'react-top-loading-bar';

// Renderizado de la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadingBarContainer props={{ color: '#28a745', height: 3 }}>
      <BrowserRouter>      
        <App />      
      </BrowserRouter>
    </LoadingBarContainer>
  </React.StrictMode>
);