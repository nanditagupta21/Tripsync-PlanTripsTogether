
const ROUTE_COSTS = {
  "bangalore-manali": {
    train: 2200,
    bus: 2500,
    road: 4500,
    flight: 6500,
  },
  "mumbai-manali": {
    train: 1600,
    bus: 1800,
    road: 3500,
    flight: 5000,
  },
  "bangalore-goa": {
    train: 1200,
    bus: 1500,
    road: 2500,
    flight: 3500,
  },
  "mumbai-goa": {
    train: 900,
    bus: 1000,
    road: 1800,
    flight: 3000,
  },
  "bangalore-jaipur": {
    train: 2000,
    bus: 2200,
    road: 4000,
    flight: 4500,
  },
  "mumbai-jaipur": {
    train: 1400,
    bus: 1600,
    road: 3000,
    flight: 4000,
  },
  "bangalore-rishikesh": {
    train: 1800,
    bus: 2200,
    road: 4000,
    flight: 5000,
  },
  "mumbai-rishikesh": {
    train: 1500,
    bus: 1800,
    road: 3000,
    flight: 4500,
  },
  "bangalore-kerala": {
    train: 1500,
    bus: 1800,
    road: 2500,
    flight: 3500,
  },
  "mumbai-kerala": {
    train: 1200,
    bus: 1500,
    road: 2500,
    flight: 3000,
  },
};

function normalizeCity(city) {
  return String(city || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getTransportCost(fromCity, destination, travelMode, fallbackCost) {
  const routeKey = `${normalizeCity(fromCity)}-${normalizeCity(destination)}`;

  const route = ROUTE_COSTS[routeKey];

  if (route && route[travelMode] !== undefined) {
    return {
      cost: route[travelMode],
      source: "route-estimate",
    };
  }

  return {
    cost: fallbackCost,
    source: "generic-estimate",
  };
}

module.exports = { getTransportCost };
