import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();


    useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 768;
      setIsMobile(mobileCheck);

      if (!mobileCheck) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <span>🌊</span>
          </div>
          <span className="nav-brand">EcoPraia</span>
        </div>

        {!isMobile && (
                 <div className="nav-links">
          <button onClick={() => scrollToSection("home")} className="nav-link">
            Início
          </button>
          <button onClick={() => scrollToSection("maps")} className="nav-link">
            Mapa
          </button>
          <button
            onClick={() => scrollToSection("education")}
            className="nav-link"
          >
            Educação
          </button>
          <button onClick={() => scrollToSection("guide")} className="nav-link">
            Guia
          </button>
        </div>
        )}

        {/* Auth Buttons */}
        <div className="nav-auth">
      
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="nav-button-primary"
            >
              Login
            </Button>

         
          {isMobile && (
            <div className="">
                            <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} color="#fff"/>}
          </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-list">
            <button
              onClick={() => scrollToSection("home")}
              className="nav-mobile-item"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("maps")}
              className="nav-mobile-item"
            >
              Mapa
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="nav-mobile-item"
            >
              Educação
            </button>
            <button
              onClick={() => scrollToSection("guide")}
              className="nav-mobile-item"
            >
              Guia
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
