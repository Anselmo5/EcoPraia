import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Leaf, Droplet, Wind, Zap } from "lucide-react";
import "./EducationSection.css";

interface WasteType {
  id: string;
  name: string;
  emoji: string;
  icon: React.ReactNode;
  decompositionTime: string;
  impact: string;
  examples: string[];
  color: string;
  bgGradient: string;
}

const WASTE_TYPES: WasteType[] = [
  {
    id: "plastic",
    name: "Plástico",
    emoji: "🧴",
    icon: <Droplet size={32} />,
    decompositionTime: "Até 400 anos",
    impact:
      "Causa morte de animais marinhos e contamina os oceanos com microplásticos",
    examples: ["Garrafas", "Sacolas", "Canudos", "Copos descartáveis"],
    gradient: "linear-gradient(to right, #ef4444, #dc2626)",
    bgColor: "#fef2f2",
  },
  {
    id: "glass",
    name: "Vidro",
    emoji: "🍾",
    icon: <Wind size={32} />,
    decompositionTime: "Até 1 milhão de anos",
    impact:
      "Não se decompõe naturalmente. Pode causar ferimentos em banhistas e animais",
    examples: ["Garrafas", "Copos quebrados", "Frascos"],
    gradient: "linear-gradient(to right, #14b8a6, #0d9488)",
    bgColor: "#ecfeff",
  },
  {
    id: "paper",
    name: "Papel",
    emoji: "📰",
    icon: <Zap size={32} />,
    decompositionTime: "De 3 a 6 meses",
    impact:
      "Embora se decomponha rápido, seu descarte incorreto prejudica a paisagem e atrai pragas",
    examples: ["Embalagens", "Guardanapos", "Jornais", "Caixas"],
    gradient: "linear-gradient(to right, #3b82f6, #2563eb)",
    bgColor: "#eff6ff",
  },
  {
    id: "organic",
    name: "Orgânico",
    emoji: "🍌",
    icon: <Leaf size={32} />,
    decompositionTime: "De 2 a 12 meses",
    impact:
      "Quando descartado corretamente, pode ser compostado e retornar ao solo como nutrientes",
    examples: ["Cascas de frutas", "Restos de comida", "Folhas", "Sementes"],
    gradient: "linear-gradient(to right, #f59e0b, #ea580c)",
    bgColor: "#ffedd5",
  },
  {
    id: "metal",
    name: "Metal",
    emoji: "🥫",
    icon: <AlertCircle size={32} />,
    decompositionTime: "De 100 a 1000 anos",
    impact:
      "Altamente reciclável. Reduz significativamente a extração de novos minérios",
    examples: ["Latas", "Tampas", "Fios", "Pregos"],
    gradient: "linear-gradient(to right, #6b7280, #4b5563)",
    bgColor: "#e9f1f8",
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="education-section">
      <div className="education-inner">
        {/* Header */}
        <div className="education-header">
          <h2 className="education-heading">Educação Ambiental</h2>
          <p className="education-description">
            Entenda os diferentes tipos de resíduos, seu impacto ambiental e o tempo de decomposição. Conhecimento é o primeiro passo para a mudança.
          </p>
        </div>

        {/* Cards Grid - 2-2-1 Layout */}
        <div className="education-grid">
          {WASTE_TYPES.slice(0, 4).map((waste) => (
            <Card
              key={waste.id}
              className="education-card"
              style={{ backgroundColor: waste.bgColor }}
            >
              <div className="education-card-body">
                <div className="education-color-bar" style={{ background: waste.gradient }} />
                <div className="education-card-content">
                  <div className="education-emoji">{waste.emoji}</div>
                  <h3 className="education-waste-title">{waste.name}</h3>

                  <div className="education-time-row">
                    <Clock size={16} />
                    <span>{waste.decompositionTime}</span>
                  </div>

                  <p className="education-impact">{waste.impact}</p>

                  <div>
                    <p className="education-examples-label">Exemplos:</p>
                    <div className="education-examples">
                      {waste.examples.map((example) => (
                        <span key={example} className="education-pill">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Last Card (5th) - Centered */}
        <div className="education-last-card-container">
          <div className="education-last-card-wrapper">
            <Card
              key={WASTE_TYPES[4].id}
              className="education-card"
              style={{ backgroundColor: WASTE_TYPES[4].bgColor }}
            >
              <div className="education-card-body">
                <div className="education-color-bar" style={{ background: WASTE_TYPES[4].gradient }} />
                <div className="education-card-content">
                  <div className="education-emoji">{WASTE_TYPES[4].emoji}</div>
                  <h3 className="education-waste-title">{WASTE_TYPES[4].name}</h3>

                  <div className="education-time-row">
                    <Clock size={16} />
                    <span>{WASTE_TYPES[4].decompositionTime}</span>
                  </div>

                  <p className="education-impact">{WASTE_TYPES[4].impact}</p>

                  <div>
                    <p className="education-examples-label">Exemplos:</p>
                    <div className="education-examples">
                      {WASTE_TYPES[4].examples.map((example) => (
                        <span key={example} className="education-pill">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      
        
      </div>
    </section>
  );
}
