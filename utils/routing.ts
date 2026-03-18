import { Filial } from '../data/filiais';

// Haversine distance in meters
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Simple Traveling Salesman Problem (TSP) heuristic: Nearest Neighbor
export function optimizeRouteOrder(filiais: Filial[]) {
  if (filiais.length <= 2) return filiais;

  const result: Filial[] = [filiais[0]];
  const unvisited = [...filiais.slice(1)];

  while (unvisited.length > 0) {
    const current = result[result.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = getDistance(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (d < minDistance) {
        minDistance = d;
        nearestIndex = i;
      }
    }

    result.push(unvisited[nearestIndex]);
    unvisited.splice(nearestIndex, 1);
  }

  return result;
}

// OSRM API Integration
export async function getOSRMRouting(filiais: Filial[]) {
  const coords = filiais.map(f => `${f.lng},${f.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false&annotations=distance`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok') {
      const route = data.routes[0];
      return {
        geometry: route.geometry,
        distance: route.distance, // total distance
        duration: route.duration,
        legs: route.legs // info for individual segments
      };
    } else {
      console.warn('OSRM returned non-OK code:', data.code);
    }
  } catch (err) {
    console.error('OSRM API Error:', err);
  }
  return null;
}

export function getGoogleMapsRouteUrl(filiais: Filial[]) {
  if (filiais.length < 2) return null;
  const origin = `${filiais[0].lat},${filiais[0].lng}`;
  const destination = `${filiais[filiais.length - 1].lat},${filiais[filiais.length - 1].lng}`;
  const waypoints = filiais.slice(1, -1).map(f => `${f.lat},${f.lng}`).join('/');
  
  return `https://www.google.com/maps/dir/${origin}/${waypoints ? waypoints + '/' : ''}${destination}`;
}
