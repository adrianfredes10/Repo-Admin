import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient.ts';
import { App } from './App.tsx';
import { InitApp } from './components/InitApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <InitApp>
        <App />
      </InitApp>
    </QueryClientProvider>
  </StrictMode>,
);
