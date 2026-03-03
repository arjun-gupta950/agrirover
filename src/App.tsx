import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Camera from "./pages/Camera";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropRecommend from "./pages/CropRecommend";
import Schemes from "./pages/Schemes";
import Market from "./pages/Market";
import Alerts from "./pages/Alerts";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/crop-recommend" element={<CropRecommend />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/market" element={<Market />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
