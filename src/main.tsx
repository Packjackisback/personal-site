import '@fontsource/vt323';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import HighContrastPage from './HighContrastPage';
import './index.css';

const path = window.location.pathname.replace(/\/$/, '');
const isHighContrastPage = path === '/high-contrast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isHighContrastPage ? <HighContrastPage /> : <App />}
  </StrictMode>
);
