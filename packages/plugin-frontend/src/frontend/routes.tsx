import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

import { HomePage } from './pages/HomePage';


const History = lazy(() => import('./pages/History'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/history',
    element: <History />
  }
];