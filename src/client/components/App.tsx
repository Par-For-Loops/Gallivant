import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// import Home from './Home';
const NavBar = lazy(() => import('./NavBar'));
const Login = lazy(() => import('./Login'));
// import Map from './Map';
const Camera = lazy(() => import('./Camera'));
const Tours = lazy(() => import('./Tours'));
const Tour = lazy(() => import('./tourComponents/Tour'));
const MapView = lazy(() => import('./MapView'));
const Gallery = lazy(() => import('./Gallery'));
const Reviews = lazy(() => import('./Reviews'));
const Category = lazy(() => import('./Category'));

// authentication checker for protected route loaders.
import requireAuth from '../utils/requireAuth';

const App = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <NavBar />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <MapView />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/mapview',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <MapView />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/camera',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Camera />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/gallery',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Gallery />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tours',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tours />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tour/:id',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tour />
          </Suspense>
        ),
        loader: async () => await requireAuth(),
      },
      {
        path: '/reviews/:id',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Reviews />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/categories/:category',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Category />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
    ],
  },
]);

export default App;
