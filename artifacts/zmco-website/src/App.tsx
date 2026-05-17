import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

import SmoothScroll from "@/components/SmoothScroll";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminToolbar from "@/components/AdminToolbar";
import ZmcAI from "@/components/ZmcAI";
import { AdminProvider } from "@/context/AdminContext";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Projects = lazy(() => import("@/pages/Projects"));
const Contact = lazy(() => import("@/pages/Contact"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Safety = lazy(() => import("@/pages/Safety"));
const Machinery = lazy(() => import("@/pages/Machinery"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Switch location={location} key={location}>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/projects" component={Projects} />
          <Route path="/machinery" component={Machinery} />
          <Route path="/safety" component={Safety} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isHideLayout = location.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <AnimatedBackground />
      {!isHideLayout && <Header />}
      <main>
        <Router />
      </main>
      {!isHideLayout && <Footer />}
      <AdminToolbar />
      <ZmcAI />
    </>
  );
}

function App() {
  return (
    <AdminProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SmoothScroll>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppContent />
            </WouterRouter>
            <Toaster theme="dark" position="bottom-right" />
          </SmoothScroll>
        </TooltipProvider>
      </QueryClientProvider>
    </AdminProvider>
  );
}

export default App;
