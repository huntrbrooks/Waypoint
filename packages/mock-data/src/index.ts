import type { Building, EvacuationEvent, Exit } from "@waypoint/types";

export const exits: Exit[] = [
  { id: "exit-hq-1", buildingId: "building-hq", floor: 1, lat: 40.7581, lng: -73.9855, label: "Lobby North Exit" },
  { id: "exit-hq-2", buildingId: "building-hq", floor: 1, lat: 40.7578, lng: -73.9861, label: "Loading Dock Exit" },
  { id: "exit-hq-3", buildingId: "building-hq", floor: 2, lat: 40.7584, lng: -73.9859, label: "Skybridge Stairwell" },
  { id: "exit-hq-4", buildingId: "building-hq", floor: 3, lat: 40.7576, lng: -73.9853, label: "East Fire Stair" },
  { id: "exit-hq-5", buildingId: "building-hq", floor: 4, lat: 40.7583, lng: -73.9864, label: "West Fire Stair" },
  { id: "exit-hospital-1", buildingId: "building-hospital", floor: 1, lat: 34.0523, lng: -118.2441, label: "Emergency Department Exit" },
  { id: "exit-hospital-2", buildingId: "building-hospital", floor: 1, lat: 34.052, lng: -118.2434, label: "Ambulance Bay Exit" },
  { id: "exit-hospital-3", buildingId: "building-hospital", floor: 2, lat: 34.0526, lng: -118.2436, label: "Surgery Wing Stairwell" },
  { id: "exit-hospital-4", buildingId: "building-hospital", floor: 3, lat: 34.0518, lng: -118.2444, label: "Patient Tower South Stair" },
  { id: "exit-hospital-5", buildingId: "building-hospital", floor: 5, lat: 34.0528, lng: -118.244, label: "Roof Access Stair" },
  { id: "exit-retail-1", buildingId: "building-retail", floor: 1, lat: 41.8818, lng: -87.6232, label: "Main Atrium Exit" },
  { id: "exit-retail-2", buildingId: "building-retail", floor: 1, lat: 41.8821, lng: -87.624, label: "Food Court Exit" },
  { id: "exit-retail-3", buildingId: "building-retail", floor: 2, lat: 41.8815, lng: -87.6238, label: "Cinema Stairwell" },
  { id: "exit-retail-4", buildingId: "building-retail", floor: 2, lat: 41.8824, lng: -87.6235, label: "Department Store Exit" },
  { id: "exit-retail-5", buildingId: "building-retail", floor: 3, lat: 41.8819, lng: -87.6244, label: "Parking Deck Bridge" }
];

export const buildings: Building[] = [
  {
    id: "building-hq",
    name: "Waypoint Enterprise HQ",
    address: "100 Command Ave, New York, NY",
    floors: 4,
    exits: exits.filter((exit) => exit.buildingId === "building-hq")
  },
  {
    id: "building-hospital",
    name: "MetroCare Hospital",
    address: "2400 Resilience Blvd, Los Angeles, CA",
    floors: 6,
    exits: exits.filter((exit) => exit.buildingId === "building-hospital")
  },
  {
    id: "building-retail",
    name: "Northline Retail Center",
    address: "800 Civic Plaza, Chicago, IL",
    floors: 3,
    exits: exits.filter((exit) => exit.buildingId === "building-retail")
  }
];

export const evacuationEvents: EvacuationEvent[] = [
  { id: "event-001", buildingId: "building-hq", triggeredAt: "2026-01-08T14:05:00.000Z", resolvedAt: "2026-01-08T14:12:30.000Z", userCount: 284 },
  { id: "event-002", buildingId: "building-hospital", triggeredAt: "2026-01-16T09:20:00.000Z", resolvedAt: "2026-01-16T09:31:45.000Z", userCount: 612 },
  { id: "event-003", buildingId: "building-retail", triggeredAt: "2026-01-28T18:10:00.000Z", resolvedAt: "2026-01-28T18:17:10.000Z", userCount: 940 },
  { id: "event-004", buildingId: "building-hq", triggeredAt: "2026-02-05T11:00:00.000Z", resolvedAt: "2026-02-05T11:07:40.000Z", userCount: 301 },
  { id: "event-005", buildingId: "building-hospital", triggeredAt: "2026-02-19T15:35:00.000Z", resolvedAt: "2026-02-19T15:47:20.000Z", userCount: 588 },
  { id: "event-006", buildingId: "building-retail", triggeredAt: "2026-03-02T10:15:00.000Z", resolvedAt: "2026-03-02T10:23:15.000Z", userCount: 875 },
  { id: "event-007", buildingId: "building-hq", triggeredAt: "2026-03-21T13:45:00.000Z", resolvedAt: "2026-03-21T13:52:05.000Z", userCount: 292 },
  { id: "event-008", buildingId: "building-hospital", triggeredAt: "2026-04-11T08:50:00.000Z", resolvedAt: "2026-04-11T09:01:00.000Z", userCount: 630 },
  { id: "event-009", buildingId: "building-retail", triggeredAt: "2026-04-24T19:30:00.000Z", resolvedAt: "2026-04-24T19:38:50.000Z", userCount: 1018 },
  { id: "event-010", buildingId: "building-hq", triggeredAt: "2026-05-12T16:00:00.000Z", resolvedAt: "2026-05-12T16:06:55.000Z", userCount: 276 }
];
