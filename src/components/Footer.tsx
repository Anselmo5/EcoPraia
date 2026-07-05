import {Mail,Heart } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {}
          <div>
            <div className="footer-brand-top">
              <div className="footer-brand-logo">
                <span>🌊</span>
              </div>
              <span className="footer-brand-name">EcoPraia</span>
            </div>
            <p className="footer-text">
              Consciência na Orla — Preservando as praias de Florianópolis
            </p>
          </div>

          {}
          <div>
            <h4 className="footer-heading">Links</h4>
            <ul className="footer-link-list">
              <li>
                <a href="#home" className="footer-link">
                  Início
                </a>
              </li>
              <li>
                <a href="#maps" className="footer-link">
                  Mapa
                </a>
              </li>
              <li>
                <a href="#education" className="footer-link">
                  Educação
                </a>
              </li>
              <li>
                <a href="#guide" className="footer-link">
                  Guia de Cores
                </a>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="footer-heading">Recursos</h4>
            <ul className="footer-link-list">
              <li>
                <a href="mailto:contato@ecopraia.com" className="footer-link">
                  Contato
                </a>
              </li>
              <li>
                <a href="/privacy" className="footer-link">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="/terms" className="footer-link">
                  Termos
                </a>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="footer-heading">Redes Sociais</h4>
            <div className="footer-social">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {}
        <div className="footer-divider"></div>

        {}
        <div className="footer-bottom">
          <p>
            © {currentYear} EcoPraia. Juntos pela preservação das nossas praias 
            <Heart size={16} className="footer-heart" />
          </p>
          <p>Feito com ❤️ para o meio ambiente</p>
        </div>
      </div>
    </footer>
  );
}
