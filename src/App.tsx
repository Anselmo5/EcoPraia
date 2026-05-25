import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

function App() {
  return (
          <BrowserRouter>
            <div className="app-shell">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/Perfil" element={<Perfil />} />
                </Routes>
            </div>
          </BrowserRouter>
  );
}

export default App;
