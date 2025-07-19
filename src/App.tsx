
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LearnMore from "./pages/LearnMore";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Drafts from "./pages/Drafts";
import Share from "./pages/Share";
import Messages from "./pages/Messages";
import ItemDetails from "./pages/ItemDetails";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpArticle from "./pages/HelpArticle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/share" element={<Share />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/drafts" element={<Drafts />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/share" element={<Share />} />
              <Route path="/drafts" element={<Drafts />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/help/article/:id" element={<HelpArticle />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
