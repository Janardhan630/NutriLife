import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/Toast';
import AppRoutes from '@/routes';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

/** Scrolls to the top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <ScrollToTop />
              <AppRoutes />
              <ToastContainer />
            </BrowserRouter>
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
