import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoginUrl } from "@/const";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section id="home" className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>

        <div className="hero-glow" style={{ top: "5rem", right: "2.5rem", width: "18rem", height: "18rem", background: "oklch(0.6 0.2 15)" }}></div>
        <div
          className="hero-glow hero-glow--delay"
          style={{ bottom: "-2rem", left: "5rem", width: "18rem", height: "18rem", background: "oklch(0.55 0.15 180)" }}
        ></div>

        <svg className="hero-svg-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
            className="hero-wave"
            style={{ color: "oklch(0.3 0.1 210)" }}
          />
          <path
            d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            className="hero-wave hero-wave--slow hero-wave--faint"
            style={{ color: "oklch(0.55 0.15 180)" }}
          />
          <path
            d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z"
            fill="currentColor"
            className="hero-wave hero-wave--faint"
            style={{ color: "oklch(0.6 0.15 200)" }}
          />
        </svg>
      </div>

      <div className="hero-aling-content">
            <div className="hero-content">
        <div>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="hero-badge-text">🌊 Consciência na Orla</span>
          </div>

          <h1 className="hero-title">
            <span>EcoPraia</span>
          </h1>
          <p className="hero-subtitle">
            Descubra como descartar seus resíduos de forma consciente e
            contribuir para a preservação do nosso litoral. Encontre lixeiras
            seletivas e aprenda sobre o impacto ambiental.
          </p>

          <div className="hero-actions">
            <Button onClick={() => navigate("/login")} className="hero-button-primary">
              🔐 Entrar
            </Button>
            <Button onClick={() => navigate("/maps")} variant="outline" className="hero-button-outline">
              🗯️ Explorar Mapa
            </Button>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="hero-scroll-mouse">
          <span className="hero-scroll-mouse-wheel" />
        </div>
        <div className="hero-scroll-text">
          <ChevronDown size={20} className="hero-scroll-icon" />
        </div>
      </div>
      </div>
      
    </section>
  );
}
