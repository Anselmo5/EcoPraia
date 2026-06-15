import { useState, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import Swal from "sweetalert2";
import { MapPin, Trash2, FileText } from "lucide-react";
import { MapView } from "@/components/Map";
import "./TrashCanRegistration.css";

interface TrashCanFormData {
  address: string;
  latitude: string;
  longitude: string;
  type: "seletiva" | "comum" | "mista";
  description: string;
}

export default function TrashCanRegistration() {
  const [formData, setFormData] = useState<TrashCanFormData>({
    address: "",
    latitude: "",
    longitude: "",
    type: "comum",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [registeredTrashCans, setRegisteredTrashCans] = useState<
    TrashCanFormData[]
  >([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    mapRef.current = map;


    try {
      const allow = window.confirm("Deseja permitir que a aplicação acesse sua localização atual para centralizar o mapa? (Você pode recusar)");
      if (allow && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            map.setCenter([lng, lat]);
            map.setZoom(15);

            if (markerRef.current) markerRef.current.remove();
            // visible marker element
            const el = document.createElement("div");
            el.style.width = "28px";
            el.style.height = "28px";
            el.style.borderRadius = "50%";
            el.style.background = "#0ea5e9";
            el.style.boxShadow = "0 6px 18px rgba(14,165,233,0.35)";
            el.style.border = "3px solid white";

            markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
              .setLngLat([lng, lat])
              .addTo(map);

            const latitude = lat.toFixed(6);
            const longitude = lng.toFixed(6);
            setSelectedPosition({ latitude, longitude });
            setFormData(prev => ({ ...prev, latitude, longitude }));
          },
          () => {
          }
        );
      }
    } catch (e) {
   
    }
    try {
      map.off("click");
    } catch (e) {}

    map.on("click", (event) => {
      const latitude = event.lngLat.lat.toFixed(6);
      const longitude = event.lngLat.lng.toFixed(6);

      setSelectedPosition({ latitude, longitude });
      setFormData(prev => ({
        ...prev,
        latitude,
        longitude,
      }));

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const el = document.createElement("div");
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.borderRadius = "50%";
      el.style.background = "#FF6B35";
      el.style.boxShadow = "0 8px 22px rgba(255,107,53,0.35)";
      el.style.border = "3px solid white";

      markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([Number(longitude), Number(latitude)])
        .addTo(map);


      (async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept": "application/json" } }
          );
          if (!res.ok) return;
          const data = await res.json();
          const display = data.display_name as string | undefined;
          if (display) {
            setFormData(prev => ({ ...prev, address: display }));
          }
        } catch (e) {
          // ignore reverse geocode errors
        }
      })();
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.latitude || !formData.longitude) {
      alert("Please fill in all required fields");

      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Registering trash can:", formData);

      setRegisteredTrashCans(prev => [...prev, formData]);

      setFormData({
        address: "",
        latitude: "",
        longitude: "",
        type: "comum",
        description: "",
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Lixeira registrada com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trash-registration">
      <div className="trash-header">
        <h2>Registro de Lixeiras</h2>

        <p>Ajude-nos a mapear os locais de descarte de resíduos na sua região.</p>
      </div>


      <div className="trash-card">
        <form className="trash-form" onSubmit={handleSubmit}>
          <div className="trash-field">
            <label>
              Endereço <span className="required">*</span>
            </label>

            <div className="trash-input-wrapper">
              <MapPin size={20} className="trash-input-icon" />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., Praia da Lagoa, Florianópolis"
                className="trash-input"
              />
            </div>
          </div>

          <div className="trash-grid">
            <div className="trash-field">
              <label>
                Latitude <span className="required">*</span>
              </label>

              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="-27.5945"
                className="trash-input"
              />

              <p className="trash-hint">Clique no mapa para preencher automaticamente</p>
            </div>

            {/* LONGITUDE */}
            <div className="trash-field">
              <label>
                Longitude <span className="required">*</span>
              </label>

              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="-48.5477"
                className="trash-input"
              />

              <p className="trash-hint">Clique no mapa para preencher automaticamente</p>
            </div>
          </div>

          {/* TYPE */}
          <div className="trash-field">
            <label>
              Tipo de Lixeira <span className="required">*</span>
            </label>

            <div className="trash-input-wrapper">
              <Trash2 size={20} className="trash-input-icon" />

              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="trash-select"
              >
                <option value="seletiva">Seletiva</option>
                <option value="mista">Mista</option>
              </select>
            </div>
          </div>

      
          <div className="trash-field">
            <label>Descrição (Opcional)</label>

            <div className="trash-input-wrapper">
              <FileText size={20} className="trash-textarea-icon" />

              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Adicione detalhes como condições da lixeira"
                className="trash-textarea"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="trash-submit-btn"
          >
            {isSubmitting ? "Registrando..." : "Registro da Lixeira"}
          </button>
        </form>
      </div>

      {registeredTrashCans.length > 0 && (
        <div className="trash-card">
          <h3 className="trash-list-title">
            Your Registered Trash Cans ({registeredTrashCans.length})
          </h3>

          <div className="trash-list">
            {registeredTrashCans.map((trashCan, index) => (
              <div key={index} className={`trash-item ${trashCan.type}`}>
                <div className="trash-item-top">
                  <div>
                    <p className="trash-item-address">{trashCan.address}</p>

                    <p className="trash-item-coordinates">
                      {trashCan.latitude}, {trashCan.longitude}
                    </p>
                  </div>

                  <span className="trash-badge">{trashCan.type}</span>
                </div>

                {trashCan.description && (
                  <p className="trash-item-description">
                    {trashCan.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

     
      <div className="trash-card">
        <h3 className="trash-map-title">Selecione a Localização no Mapa</h3>

        <div className="trash-map-placeholder">
          <MapView
            className="trash-map-instance"
            initialCenter={[-48.5477, -27.5954]}
            initialZoom={12}
            onMapReady={handleMapReady}
            style={{ height: "100%" }}
          />
        </div>
        <div className="trash-map-content">
          <MapPin size={20} />
          <p>
            Clique no mapa para preencher latitude e longitude automaticamente.
          </p>
          {selectedPosition && (
            <span>
              Selecionado: {selectedPosition.latitude}, {selectedPosition.longitude}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
