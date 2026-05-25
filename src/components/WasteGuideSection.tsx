import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import "./WasteGuideSection.css";

interface WasteBin {
  id: string;
  color: string;
  name: string;
  wasteType: string;
  description: string;
  examples: string[];
  bgColor: string;
  icon: string;
}

const WASTE_BINS: WasteBin[] = [
  {
    id: "red",
    color: "#E63946",
    name: "Vermelho",
    wasteType: "Plástico",
    description:
      "Todos os tipos de plástico devem ser descartados aqui. Garrafas, sacolas, embalagens e outros itens plásticos.",
    examples: ["Garrafas PET", "Sacolas plásticas", "Embalagens", "Canudos"],
    bgColor: "#fef2f2",
    icon: "🔴",
  },
  {
    id: "green",
    color: "#2A9D8F",
    name: "Verde",
    wasteType: "Vidro",
    description:
      "Garrafas, copos e frascos de vidro. Cuidado ao descartar para evitar ferimentos.",
    examples: ["Garrafas de vidro", "Copos", "Frascos", "Potes"],
    bgColor: "#ecfdf5",
    icon: "🟢",
  },
  {
    id: "blue",
    color: "#457B9D",
    name: "Azul",
    wasteType: "Papel",
    description:
      "Papéis, papelão e embalagens de papel. Mantenha seco para facilitar a reciclagem.",
    examples: ["Jornais", "Revistas", "Caixas", "Embalagens"],
    bgColor: "#eff6ff",
    icon: "🔵",
  },
  {
    id: "yellow",
    color: "#F4A261",
    name: "Amarelo",
    wasteType: "Metal",
    description:
      "Latas, tampas e outros itens de metal. Limpe antes de descartar se possível.",
    examples: ["Latas de refrigerante", "Tampas", "Parafusos", "Fios"],
    bgColor: "#fef3c7",
    icon: "🟡",
  },
  {
    id: "brown",
    color: "#8B7355",
    name: "Marrom",
    wasteType: "Orgânico",
    description:
      "Restos de comida, cascas de frutas e outros resíduos orgânicos biodegradáveis.",
    examples: ["Restos de comida", "Cascas", "Folhas", "Sementes"],
    bgColor: "#fff7ed",
    icon: "🟤",
  },
];

export default function WasteGuideSection() {
  const [visibleBins, setVisibleBins] = useState<Set<string>>(new Set());
  const binRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) {
              setVisibleBins((prev) => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    binRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="guide" className="guide-section">
      <div className="guide-inner">
        {/* Header */}
        <div className="guide-header">
          <h2 className="guide-heading">Guia de Cores das Lixeiras</h2>
          <p className="guide-description">
            Cada cor representa um tipo diferente de resíduo. Aprenda a descartar corretamente e contribua para um futuro sustentável.
          </p>
        </div>

        {/* Bins Grid - 2-2-1 Layout */}
        <div className="guide-grid">
          {WASTE_BINS.slice(0, 4).map((bin, index) => (
            <div
              key={bin.id}
              ref={(el) => {
                if (el) binRefs.current.set(bin.id, el);
              }}
              data-id={bin.id}
              className={`guide-bin ${visibleBins.has(bin.id) ? "visible" : ""}`}
              style={{ transitionDelay: visibleBins.has(bin.id) ? `${index * 100}ms` : "0ms" }}
            >
              <Card className="guide-card" style={{ backgroundColor: bin.bgColor }}>
                {/* Bin Visualization - Improved */}
                <div className="guide-bin-visual">
                  {/* Large Icon */}
                  <div className="guide-bin-icon">{bin.icon}</div>
                </div>

                {/* Content */}
                <div className="guide-card-body">
                  {/* Color Badge */}
                  <div>
                    <Badge className="guide-badge" style={{ backgroundColor: bin.color }}>
                      {bin.name}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="guide-bin-title">{bin.wasteType}</h3>

                  {/* Description */}
                  <p className="guide-bin-description">{bin.description}</p>

                  {/* Examples */}
                  <div className="guide-bin-examples">
                    <p className="guide-bin-examples-label">Exemplos:</p>
                    {bin.examples.map((example) => (
                      <span key={example} className="guide-bin-example">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Last Bin (5th) - Centered */}
        <div className="guide-last-bin-container">
          <div className="guide-last-bin">
            <div
              key={WASTE_BINS[4].id}
              ref={(el) => {
                if (el) binRefs.current.set(WASTE_BINS[4].id, el);
              }}
              data-id={WASTE_BINS[4].id}
              className={`guide-bin ${visibleBins.has(WASTE_BINS[4].id) ? "visible" : ""}`}
              style={{
                transitionDelay: visibleBins.has(WASTE_BINS[4].id) ? "400ms" : "0ms",
              }}
            >
              <Card className="guide-card" style={{ backgroundColor: WASTE_BINS[4].bgColor }}>
                {/* Bin Visualization - Improved */}
                <div className="guide-bin-visual">
                  {/* Large Icon */}
                  <div className="guide-bin-icon">{WASTE_BINS[4].icon}</div>
                </div>

                {/* Content */}
                <div className="guide-card-body">
                  {/* Color Badge */}
                  <div>
                    <Badge className="guide-badge" style={{ backgroundColor: WASTE_BINS[4].color }}>
                      {WASTE_BINS[4].name}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="guide-bin-title">{WASTE_BINS[4].wasteType}</h3>

                  {/* Description */}
                  <p className="guide-bin-description">{WASTE_BINS[4].description}</p>

                  {/* Examples */}
                  <div className="guide-bin-examples">
                    <p className="guide-bin-examples-label">Exemplos:</p>
                    {WASTE_BINS[4].examples.map((example) => (
                      <span key={example} className="guide-bin-example">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

  
        <Card className="guide-tips-card">
          <h3 className="guide-tips-heading">
            <span className="guide-tips-icon">💡</span>
            Dicas Importantes
          </h3>
          <div className="guide-tips-grid">
            {/* Do's */}
            <div>
              <div className="guide-tips-header">
                <CheckCircle2 className="guide-tips-icon-check" />
                <h4 className="guide-tips-title">✅ Faça</h4>
              </div>
              <ul className="guide-tips-list">
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-success">•</span>
                  <span>Limpe garrafas, latas e embalagens antes de descartar</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-success">•</span>
                  <span>Separe corretamente por tipo de resíduo</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-success">•</span>
                  <span>Comprima embalagens para economizar espaço</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-success">•</span>
                  <span>Reutilize quando possível antes de reciclar</span>
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div>
              <div className="guide-tips-header">
                <AlertCircle className="guide-tips-icon-alert" />
                <h4 className="guide-tips-title">❌ Não Faça</h4>
              </div>
              <ul className="guide-tips-list">
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-danger">•</span>
                  <span>Não misture resíduos de tipos diferentes</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-danger">•</span>
                  <span>Não descarte resíduos perigosos ou tóxicos</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-danger">•</span>
                  <span>Não jogue lixo fora das lixeiras seletivas</span>
                </li>
                <li className="guide-tips-item">
                  <span className="guide-tips-dot guide-tips-dot-danger">•</span>
                  <span>Não sobrecarregue as lixeiras além da capacidade</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
