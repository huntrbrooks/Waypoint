const baseUrl = process.env.WAYPOINT_API_URL ?? "http://localhost:3001";
const token = process.env.WAYPOINT_API_TOKEN ?? "demo-token";

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}`);
  }

  return response.json();
};

const health = await request("/health");
const me = await request("/me");
const buildings = await request("/buildings");
const firstBuilding = buildings[0];

if (!health.ok || !me.id || !firstBuilding) {
  throw new Error("API health, user, or building smoke check failed");
}

const exits = await request(`/buildings/${firstBuilding.id}/exits`);
const exit = await request(`/buildings/${firstBuilding.id}/exits`, {
  method: "POST",
  body: JSON.stringify({
    lat: firstBuilding.exits[0]?.lat ?? 40.7589,
    lng: firstBuilding.exits[0]?.lng ?? -73.9851,
    floor: 1,
    label: "Smoke Test Exit"
  })
});
const event = await request(`/buildings/${firstBuilding.id}/evacuate`, { method: "POST" });
const events = await request("/events");
const fetchedEvent = await request(`/events/${event.id}`);

if (!Array.isArray(exits) || exit.label !== "Smoke Test Exit" || !Array.isArray(events) || fetchedEvent.id !== event.id) {
  throw new Error("API evacuation or exit smoke check failed");
}

console.log(`Waypoint API smoke check passed against ${baseUrl}`);
