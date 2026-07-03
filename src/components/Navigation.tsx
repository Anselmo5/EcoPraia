import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getRole, fetchCurrentUserRole } from "@/lib/api";
import "./Navigation.css";

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 768;
      setIsMobile(mobileCheck);

      if (!mobileCheck) {
        setMobileMenuOpen(false);
      }
    };

    const syncAuthState = async () => {
      const authenticatedState = isAuthenticated();
      setAuthenticated(authenticatedState);

      let roleValue = getRole();
      if (authenticatedState && !roleValue) {
        roleValue = await fetchCurrentUserRole();
      }
      setRole(roleValue);
    };

    syncAuthState();
    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    if (authenticated) {
      navigate("/perfil");
    } else {
      navigate("/login");
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

   
        <div className="nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '1rem',}}>
          {authenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold',}}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
              Logado
              {role === 'ROLE_ADMIN' && (
                <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#10b981', color: 'white', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                  Admin
                </span>
              )}
            </div>
          )}
      
            <Button
              onClick={handleLoginClick}
              variant="outline"
              className="nav-button-primary"
            >
              {authenticated ? "Perfil" : "Entrar"}
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

      {}
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
