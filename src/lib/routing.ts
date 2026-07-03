import { Client as OSRMClient } from "osrm-client";

const osrmClient = new OSRMClient({
  host: "router.project-osrm.org",
});

export interface RoutingRequest {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export interface RoutingResponse {
  coordinates: [number, number][];
  distance: number; 
  duration: number; 
}


export async function calculateRoute(request: RoutingRequest): Promise<RoutingResponse> {
  try {
    const result = await osrmClient.route({
      coordinates: [
        [request.from.lng, request.from.lat],
        [request.to.lng, request.to.lat],
      ],
      overview: "full",
      geometries: "geojson",
    });

    if (!result.routes || result.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = result.routes[0];
    const geometry = route.geometry as any;
    const coordinates = geometry.coordinates as [number, number][];

    return {
      coordinates,
      distance: route.distance || 0,
      duration: route.duration || 0,
    };
  } catch (error) {
    console.error("OSRM routing error:", error);
    throw error;
  }
}

export default { calculateRoute };
