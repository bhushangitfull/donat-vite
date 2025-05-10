import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import EventsPage from "@/pages/EventsPage";
import NewsPage from "@/pages/NewsPage";
import ContactPage from "@/pages/ContactPage";
import DonatePage from "@/pages/DonatePage";
import AdminPage from "@/pages/AdminPage";
import Dashboard2 from "@/pages/Dashboard2"

// Firebase config check
import { auth } from "./lib/firebase";

function Router() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase auth is initialized
    if (auth) {
      setIsFirebaseReady(true);
    }
  }, []);

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/events/:id">{(params) => <EventsPage id={params.id} />}</Route>
          <Route path="/news" component={NewsPage} />
          <Route path="/news/:id">{(params) => <NewsPage id={params.id} />}</Route>
          <Route path="/contact" component={ContactPage} />
          <Route path="/donate" component={DonatePage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/dashboard" component={Dashboard2} />
          <Route path="/admin/:section">{(params) => <AdminPage section={params.section} />}</Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}


function AppContent() {
  const [location] = useLocation();
  const showLayout = location !== "/dashboard";
  return (
    <>
      {showLayout && <Navbar />}
      <Router />
      {showLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
