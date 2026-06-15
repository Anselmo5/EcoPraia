import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import Swal from "sweetalert2";
import { MapView } from "@/components/Map";
import mockApi from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Loader2, MapPin, Navigation, X } from "lucide-react";
import "./Maps.css";

interface TrashLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  beach: string;
  types: string[];
  address: string;
}

interface TrashRegistration {
  name: string;
  beach: string;
  types: string[];
  address: string;
  lat: number;
  lng: number;
}

const TRASH_LOCATIONS: TrashLocation[] = [
  {
    id: "1",
    lat: -27.5954,
    lng: -48.5477,
    name: "Lixeiras Praia Mole",
    beach: "Praia Mole",
    types: ["Plástico", "Vidro", "Papel"],
    address: "Praia Mole, Florianópolis",
  },
  {
    id: "2",
    lat: -27.6062,
    lng: -48.5403,
    name: "Lixeiras Lagoa da Conceição",
    beach: "Lagoa da Conceição",
    types: ["Plástico", "Orgânico", "Metal"],
    address: "Lagoa da Conceição, Florianópolis",
  },
  {
    id: "3",
    lat: -27.5883,
    lng: -48.5322,
    name: "Lixeiras Praia Brava",
    beach: "Praia Brava",
    types: ["Vidro", "Papel", "Metal"],
    address: "Praia Brava, Florianópolis",
  },
  {
    id: "4",
    lat: -27.6412,
    lng: -48.5244,
    name: "Lixeiras Praia Campeche",
    beach: "Praia Campeche",
    types: ["Plástico", "Vidro", "Orgânico"],
    address: "Praia Campeche, Florianópolis",
  },
  {
    id: "5",
    lat: -27.5706,
    lng: -48.5176,
    name: "Lixeiras Praia Joaquina",
    beach: "Praia Joaquina",
    types: ["Plástico", "Papel", "Metal"],
    address: "Praia Joaquina, Florianópolis",
  },
];

const WASTE_TYPE_COLORS: Record<string, string> = {
  Plástico: "#E63946",
  Vidro: "#2A9D8F",
  Papel: "#457B9D",
  Orgânico: "#F4A261",
  Metal: "#4e8d39",
};

const WASTE_TYPES = ["Plástico", "Vidro", "Papel", "Orgânico", "Metal"];


export default function MapsPage() {
  const navigate = useNavigate();
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const typesDropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedTrash, setSelectedTrash] = useState<TrashLocation | null>(null);
  const [showRouting, setShowRouting] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TrashRegistration>>({
    name: "",
    beach: "",
    address: "",
  });
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);

  // Get user location on mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (!navigator.geolocation) {
        setUserLocation({ lat: -27.5954, lng: -48.5477 });
        return;
      }

      // Ask for permission
      try {
        const result = await Swal.fire({
          title: "Localização",
          text: "Deseja permitir que a aplicação acesse sua localização para centralizar o mapa e calcular rotas com precisão?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#22c55e",
          cancelButtonColor: "#ef4444",
          confirmButtonText: "Permitir",
          cancelButtonText: "Recusar",
          allowOutsideClick: false,
        });

        if (!result.isConfirmed) {
          setUserLocation({ lat: -27.5954, lng: -48.5477 });
          return;
        }
      } catch (error) {
        console.error("Erro ao mostrar modal:", error);
        setUserLocation({ lat: -27.5954, lng: -48.5477 });
        return;
      }

      const handlePosition = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      };

      const handleError = (error: GeolocationPositionError) => {
        console.error("Erro ao obter localização:", error);
        Swal.fire({
          title: "Erro",
          text: "Não foi possível obter sua localização. Usando localização padrão.",
          icon: "warning",
          confirmButtonColor: "#22c55e",
        });
        setUserLocation({ lat: -27.5954, lng: -48.5477 });
      };

      navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      });

      const watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    };

    requestLocationPermission();
  }, []);

  const clearRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const routeSource = map.getSource("route") as maplibregl.GeoJSONSource | undefined;
      if (routeSource) {
        const empty = {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
          properties: {},
        } as GeoJSON.Feature<GeoJSON.LineString>;
        routeSource.setData(empty);
      }
    } catch (error) {
      console.error("Erro ao limpar rota:", error);
    }
  }, []);

  const updateRoute = useCallback(
    async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
      const map = mapRef.current;
      if (!map) return;

      setIsRoutingLoading(true);

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`OSRM request failed: ${response.status}`);
        }

        const data = await response.json();
        const coordinates = data?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
        const distance = data?.routes?.[0]?.distance as number | undefined;
        const duration = data?.routes?.[0]?.duration as number | undefined;

        if (!coordinates || coordinates.length === 0) {
          throw new Error("Nenhuma rota encontrada");
        }

        const routeSource = map.getSource("route") as maplibregl.GeoJSONSource | undefined;
        if (routeSource) {
          const routeGeoJSON = {
            type: "Feature",
            geometry: { type: "LineString", coordinates },
            properties: {},
          } as GeoJSON.Feature<GeoJSON.LineString>;
          routeSource.setData(routeGeoJSON);
        }

        if (distance) {
          setRouteDistance(`${(distance / 1000).toFixed(1)} km`);
        }
        if (duration) {
          const mins = Math.round(duration / 60);
          setRouteDuration(`${mins} min`);
        }

        const bounds = coordinates.reduce(
          (acc, coord) => acc.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
        );

        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 800 });
      } catch (error) {
        console.error("Erro ao buscar rota:", error);
        clearRoute();
      } finally {
        setIsRoutingLoading(false);
      }
    },
    [clearRoute]
  );

  // Initialize map
  const handleMapReady = async (map: maplibregl.Map) => {
    setIsLoading(false);
    mapRef.current = map;

    // create empty route source + layer
    if (!map.getSource("route")) {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
          properties: {},
        } as GeoJSON.Feature<GeoJSON.LineString>,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#2563eb",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    }

    // Add trash location markers (built-in + saved from mock API)
    const saved = await mockApi.getAllTrashes();
    const allLocations: TrashLocation[] = [...TRASH_LOCATIONS, ...saved];

    allLocations.forEach((location) => {
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

      // set selected when marker clicked
      marker.getElement().addEventListener("click", () => {
        setSelectedTrash(location);
      });
    });

    // center will be handled by effect when userLocation becomes available
    map.setCenter([-48.5477, -27.5954]);
    map.setZoom(12);
  };

  // If userLocation becomes available after map init, center map and add user marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userLocation) {
      map.setCenter([userLocation.lng, userLocation.lat]);
      map.setZoom(14);

      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      } else {
        userMarkerRef.current = new maplibregl.Marker({ color: "#22c55e" })
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML("<p>Sua localização</p>"))
          .addTo(map);
      }
    }
  }, [userLocation]);

  // Update route when showRouting changes
  useEffect(() => {
    if (showRouting && selectedTrash && userLocation) {
      updateRoute(userLocation, { lat: selectedTrash.lat, lng: selectedTrash.lng });
    } else if (!showRouting) {
      clearRoute();
      setRouteDistance(null);
      setRouteDuration(null);
    }
  }, [showRouting, selectedTrash, userLocation, updateRoute, clearRoute]);

  const handleAddTrash = () => {
    if (userLocation) {
      setFormData({
        ...formData,
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
    }
    setIsDialogOpen(true);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.beach || selectedTypes.length === 0) {
      Swal.fire({
        title: "Erro",
        text: "Preencha todos os campos",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    const newTrash = {
      ...formData,
      types: selectedTypes,
    };

    // Save via mock API (localStorage)
    try {
      const saved = await mockApi.addTrash({
        lat: newTrash.lat as number,
        lng: newTrash.lng as number,
        name: newTrash.name as string,
        beach: newTrash.beach as string,
        types: (newTrash.types as string[]) || [],
        address: (newTrash.address as string) || "",
      });

      // Reset form
      setFormData({ name: "", beach: "", address: "" });
      setSelectedTypes([]);
      setIsDialogOpen(false);

      Swal.fire({
        title: "Sucesso!",
        text: "Lixeira registrada com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });

      // add marker to map immediately (use saved id)
      const map = mapRef.current;
      if (map && saved.lat && saved.lng) {
        const marker = new maplibregl.Marker({ color: "#FF6B35" })
          .setLngLat([saved.lng, saved.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `
                <div style="padding: 12px; font-family: Inter, sans-serif;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${saved.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${saved.address}</p>
                </div>
              `
            )
          )
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedTrash(saved);
        });
      }
    } catch (err) {
      console.error("Erro ao salvar lixeira mock:", err);
      Swal.fire({
        title: "Erro",
        text: "Não foi possível salvar a lixeira. Veja o console.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  // Close types dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = typesDropdownRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setShowTypesDropdown(false);
    }

    if (showTypesDropdown) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [showTypesDropdown]);

  return (
    <div className="maps-page">
      {/* Exit button */}
      <div className="maps-exit-container">
        <Button variant="ghost" onClick={() => navigate('/')}>Sair</Button>
      </div>
      {isLoading && (
        <div className="maps-loading-overlay">
          <Loader2 size={32} className="animate-spin" />
        </div>
      )}

      <MapView onMapReady={handleMapReady} style={{ width: "100vw", height: "100vh" }} className="maps-full" />

      {/* Button to add trash */}
      <div className="maps-fab-container">
        <Button
          onClick={handleAddTrash}
          className="maps-fab"
          size="lg"
        >
          <Plus size={24} />
          <span>Adicionar Lixeira</span>
        </Button>
      </div>

      {/* User location info */}
      {userLocation && (
        <div className="maps-user-location">
          <div className="maps-location-badge">
            <MapPin size={16} />
            <span>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* Selected Trash Details Card */}
      {selectedTrash && userLocation && (
        <div className="maps-trash-details-card">
          <div className="maps-card-header">
            <h3>{selectedTrash.name}</h3>
            <button 
              className="maps-card-close-btn"
              onClick={() => {
                setSelectedTrash(null);
                setShowRouting(false);
                clearRoute();
              }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="maps-card-location-row">
            <div className="maps-card-location-item">
              <span className="maps-card-location-label">De:</span>
              <span className="maps-card-location-value">Sua localização</span>
              <span className="maps-card-location-coords">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            </div>
            <div className="maps-card-arrow">→</div>
            <div className="maps-card-location-item">
              <span className="maps-card-location-label">Para:</span>
              <span className="maps-card-location-value">{selectedTrash.name}</span>
              <span className="maps-card-location-coords">{selectedTrash.lat.toFixed(4)}, {selectedTrash.lng.toFixed(4)}</span>
            </div>
          </div>

          <div className="maps-card-info">
            <p className="maps-card-address"><strong>Endereço:</strong> {selectedTrash.address}</p>
            <p className="maps-card-beach"><strong>Praia:</strong> {selectedTrash.beach}</p>
          </div>

          <div className="maps-card-waste-section">
            <h4 className="maps-card-waste-title">Tipos de Resíduos Aceitos</h4>
            <div className="maps-card-types">
              {selectedTrash.types.map((type) => (
                <span key={type} className="maps-card-type-badge" style={{ background: WASTE_TYPE_COLORS[type] }}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          {showRouting && routeDistance && routeDuration && (
            <div className="maps-card-route-info">
              <p><strong>Distância:</strong> {routeDistance}</p>
              <p><strong>Tempo estimado:</strong> {routeDuration}</p>
            </div>
          )}

          <div className="maps-card-actions">
            {!showRouting ? (
              <Button 
                onClick={() => setShowRouting(true)}
                className="maps-card-route-btn"
                disabled={isRoutingLoading}
              >
                {isRoutingLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Traçando...
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    Traçar Rota
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => setShowRouting(false)}
                variant="outline"
                className="maps-card-clear-btn"
              >
                <X size={16} />
                Limpar Rota
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialog for adding trash */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="maps-dialog">
          <DialogHeader>
            <DialogTitle>Registrar Nova Lixeira</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="maps-form">
            <div className="maps-form-group">
              <Label htmlFor="name">Nome da Lixeira</Label>
              <Input
                id="name"
                placeholder="Ex: Lixeiras Praia Central"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="maps-form-group">
              <Label htmlFor="beach">Nome da Praia</Label>
              <Input
                id="beach"
                placeholder="Ex: Praia Central"
                value={formData.beach || ""}
                onChange={(e) => setFormData({ ...formData, beach: e.target.value })}
              />
            </div>

            <div className="maps-form-group">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Ex: Avenida Beira Mar, 1000"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="maps-form-group">
              <Label>Tipos de Resíduos Aceitos</Label>
              <div className="maps-multiselect">
                <button
                  type="button"
                  className="maps-multiselect-button"
                  onClick={() => setShowTypesDropdown((s) => !s)}
                >
                  {selectedTypes.length > 0
                    ? selectedTypes.join(", ")
                    : "Selecione os tipos..."}
                </button>

                {showTypesDropdown && (
                  <div ref={typesDropdownRef} className="maps-multiselect-dropdown">
                    {WASTE_TYPES.map((type) => (
                      <label key={type} className="maps-multiselect-item">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span className="maps-multiselect-item-label">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="maps-form-group">
              <Label>Localização</Label>
              <div className="maps-location-display">
                <p>Latitude: {(formData.lat || 0).toFixed(4)}</p>
                <p>Longitude: {(formData.lng || 0).toFixed(4)}</p>
              </div>
            </div>

            <div className="maps-form-actions">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Lixeira</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {isRoutingLoading && (
        <div className="maps-routing-loading">
          <Loader2 size={20} className="animate-spin" />
          <span>Traçando rota...</span>
        </div>
      )}
    </div>
  );
}
