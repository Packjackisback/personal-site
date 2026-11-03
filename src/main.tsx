import '@fontsource/vt323';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import HighContrastPage from './HighContrastPage';
import './index.css';

const path = window.location.pathname.replace(/\/$/, '');
const isHighContrastRoute = path === '/high-contrast';

function isBotVisitor(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  return /bot|crawler|spider|crawl|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandexbot|python-requests|curl|wget|httpclient|headless|phantom|selenium|puppeteer|playwright/.test(ua);
}

const serveHighContrast = isHighContrastRoute || isBotVisitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {serveHighContrast ? <HighContrastPage /> : <App />}
  </StrictMode>
);
