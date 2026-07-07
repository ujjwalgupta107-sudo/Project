import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

export function App() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
