import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { ParentalControlProvider } from './context/ParentalControlContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UserProvider>
      <ProgressProvider>
        <ParentalControlProvider>
          <App />
        </ParentalControlProvider>
      </ProgressProvider>
    </UserProvider>
  </React.StrictMode>
);
