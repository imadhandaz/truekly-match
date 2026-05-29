// Geolocalización real — coordenadas de barrios de Madrid + Haversine

const NEIGHBORHOOD_COORDS = {
  Centro:      [40.4153, -3.7024],
  Chamberí:    [40.4358, -3.7016],
  Salamanca:   [40.4307, -3.6773],
  Retiro:      [40.4091, -3.6847],
  Malasaña:    [40.4278, -3.7060],
  Lavapiés:    [40.4058, -3.7043],
  Moncloa:     [40.4344, -3.7199],
  Chamartín:   [40.4589, -3.6775],
  Tetuán:      [40.4572, -3.7001],
  Latina:      [40.4057, -3.7213],
  Carabanchel: [40.3900, -3.7350],
  Vallecas:    [40.3898, -3.6626],
  Hortaleza:   [40.4800, -3.6610],
  Madrid:      [40.4168, -3.7038],
};

export function getNeighborhoodCoords(neighborhood) {
  return NEIGHBORHOOD_COORDS[neighborhood] || NEIGHBORHOOD_COORDS.Madrid;
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function formatDistance(km) {
  if (km < 0.1) return "Aquí cerca";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("No soportado"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  });
}

export function addDistances(cards, userLocation) {
  if (!userLocation) return cards;
  return cards
    .map((card) => {
      const neighborhood = card.location?.split("· ")[1] || "Madrid";
      const [lat, lng] = getNeighborhoodCoords(neighborhood);
      const km = haversineKm(userLocation.lat, userLocation.lng, lat, lng);
      return { ...card, distance: formatDistance(km), _km: km };
    })
    .sort((a, b) => a._km - b._km);
}
