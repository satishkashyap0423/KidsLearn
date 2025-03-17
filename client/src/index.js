import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { ParentalControlProvider } from './context/ParentalControlContext';
import { Analytics } from "@vercel/analytics/dist/react";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UserProvider>
      <ProgressProvider>
        <ParentalControlProvider>
          <App />
          <Analytics/>
        </ParentalControlProvider>
      </ProgressProvider>
    </UserProvider>
  </React.StrictMode>
);
