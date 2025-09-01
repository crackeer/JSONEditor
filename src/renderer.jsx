import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './frontend/App'
import '@fontsource/roboto/300.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)