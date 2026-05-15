import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import Index from './pages/Index';
import RoomDetail from './pages/RoomDetail';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';
// MODULE_IMPORTS_START
// MODULE_IMPORTS_END

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* MODULE_PROVIDERS_START */}
    {/* MODULE_PROVIDERS_END */}
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/izba/:roomId" element={<RoomDetail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
            {/* MODULE_ROUTES_START */}
            {/* MODULE_ROUTES_END */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
    {/* MODULE_PROVIDERS_CLOSE */}
  </QueryClientProvider>
);

export default App;
