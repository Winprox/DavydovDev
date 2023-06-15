import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './app.css';
const Main = lazy(() => import('./Main'));
const Chart = lazy(() => import('../../../chart/src/app/Main'));

if (!import.meta.env.DEV) disableReactDevTools();
createRoot(document.querySelector('#app')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Chart />} path='chart' />
      <Route element={<Main />} path='*' />
    </Routes>
  </BrowserRouter>
);
