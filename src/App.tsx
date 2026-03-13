import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "@/components/LoadingScreen";
import InkCursor from "@/components/InkCursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SentryDebugButton from "./components/SentryDebugButton";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>The error has been reported automatically. Please refresh the page.</p>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <InkCursor />
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              {isLoading && <LoadingScreen onComplete={() => { }} />}
            </AnimatePresence>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
        <Analytics />
        <SentryDebugButton />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};

export default App;
