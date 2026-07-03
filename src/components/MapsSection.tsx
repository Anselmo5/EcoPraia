import { useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapView } from "@/components/Map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";
import "./MapsSection.css";

interface TrashLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  beach: string;
  types: string[];
  address: string;
}


const TRASH_LOCATIONS: TrashLocation[] = [
  {
    id: "1",
    lat: -27.6032,
    lng: -48.4354,
    name: "Lixeiras Praia Mole",
    beach: "Praia Mole",
    types: ["Plástico", "Vidro", "Papel"],
    address: "Faixa de areia central - Praia Mole",
  },

  {
    id: "2",
    lat: -27.6047,
    lng: -48.4589,
    name: "Lixeiras Lagoa da Conceição",
    beach: "Lagoa da Conceição",
    types: ["Plástico", "Orgânico", "Metal"],
    address: "Centrinho da Lagoa da Conceição",
  },

  {
    id: "3",
    lat: -27.3993,
    lng: -48.4154,
    name: "Lixeiras Praia Brava",
    beach: "Praia Brava",
    types: ["Vidro", "Papel", "Metal"],
    address: "Faixa de areia central - Praia Brava",
  },

  {
    id: "4",
    lat: -27.6946,
    lng: -48.4779,
    name: "Lixeiras Praia do Campeche",
    beach: "Praia do Campeche",
    types: ["Plástico", "Vidro", "Orgânico"],
    address: "Faixa de areia central - Praia do Campeche",
  },
];

const WASTE_TYPE_COLORS: Record<string, string> = {
  Plástico: "#E63946",
  Vidro: "#2A9D8F",
  Papel: "#457B9D",
  Orgânico: "#F4A261",
  Metal: "#4e8d39",
};

export default function MapsSection() {
  const mapRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<TrashLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMapReady = (map: maplibregl.Map) => {
    setIsLoading(false);
    setMapError(null);
    mapRef.current = map;

    TRASH_LOCATIONS.forEach((location) => {
      const marker = new maplibregl.Marker({ color: "#FF6B35" })
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `
              <div style="padding: 12px; font-family: Inter, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${location.address}</p>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                  ${location.types
                    .map(
                      (type) =>
                        `<span style="background: ${WASTE_TYPE_COLORS[type]}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">${type}</span>`
                    )
                    .join("")}
                </div>
              </div>
            `
          )
        )
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        setSelectedLocation(location);
      });
    });

    map.setCenter([-48.5477, -27.5954]);
    map.setZoom(12);
  };

  return (
    <section id="maps" className="maps-section">
      <div className="maps-inner">
        {/* Header */}
        <div className="maps-header">
          <h2 className="maps-heading">Mapa Interativo</h2>
          <p className="maps-description">
            Localize as lixeiras seletivas nas praias de Florianópolis e contribua com a preservação do nosso litoral
          </p>
        </div>

      
        <div className="maps-map-container">
          {isLoading && !mapError && (
            <div className="maps-loading">
              <Loader2 size={32} className="" />
            </div>
          )}
          <MapView onMapReady={handleMapReady} />
          {mapError && (
            <div className="maps-error">
              <p>Não foi possível carregar o mapa.</p>
              <p>{mapError}</p>
            </div>
          )}
        </div>

        <div className="maps-info-grid">
         
          <div>
            <h3 className="maps-heading" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Lixeiras Próximas
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {TRASH_LOCATIONS.map((location) => (
                <Card
                  key={location.id}
                  className={`maps-location-card${selectedLocation?.id === location.id ? " selected" : ""}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="maps-location-header">
                    <MapPin size={24} style={{ color: "var(--accent)", marginTop: "0.25rem", flexShrink: 0 }} />
                    <div>
                      <h4 className="maps-location-title">{location.name}</h4>
                      <p className="maps-location-subtitle">{location.beach}</p>
                      <div className="maps-type-badges">
                        {location.types.map((type) => (
                          <Badge key={type} variant="outline" className="maps-type-badge">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="maps-heading" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Detalhes
            </h3>
            {selectedLocation ? (
              <Card className="maps-detail-card">
                <div style={{ marginBottom: "1rem" }}>
                  <h4 className="maps-detail-title">{selectedLocation.name}</h4>
                  <p className="maps-detail-text">{selectedLocation.address}</p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p className="maps-detail-text" style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
                    Tipos de Resíduos Aceitos:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {selectedLocation.types.map((type) => (
                      <div
                        key={type}
                        style={{
                          backgroundColor: WASTE_TYPE_COLORS[type],
                          color: "white",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="maps-detail-row">
                  <p>Latitude: {selectedLocation.lat.toFixed(4)}</p>
                  <p>Longitude: {selectedLocation.lng.toFixed(4)}</p>
                </div>
              </Card>
            ) : (
              <Card className="maps-detail-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "var(--muted-foreground)" }}>
                <p>Selecione uma localização no mapa para ver detalhes</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
