import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import VideoChat from "./pages/VideoChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/video" element={<VideoChat />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
