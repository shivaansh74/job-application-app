import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Add these styles to your index.css
const styles = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .dark {
    color-scheme: dark;
  }

  body {
    @apply transition-colors duration-200;
  }
`;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
