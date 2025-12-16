import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "next-themes";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Install from "./pages/Install";
import DonationSuccess from "./pages/DonationSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShownSplash = sessionStorage.getItem("splashShown");
    
    if (hasShownSplash) {
      setShowSplash(false);
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary fallbackTitle="Application Error" fallbackDescription="The application encountered an error. Please reload to continue.">
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <OfflineIndicator />
              {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
              <BrowserRouter>
                <ErrorBoundary fallbackTitle="Page Error" fallbackDescription="This page encountered an error. Try navigating to another section.">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="/donation-success" element={<DonationSuccess />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
