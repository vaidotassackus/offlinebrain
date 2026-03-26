import type { MapRegion } from './types';

export const MOCK_REGIONS: MapRegion[] = [
  {
    id: 'us-northeast',
    name: 'US Northeast',
    description: 'New York, Boston, Philadelphia metro areas',
    bounds: { north: 42.5, south: 39.5, east: -71.0, west: -76.0 },
    sizeBytes: 450_000_000,
    downloadStatus: 'available',
    downloadedAt: null,
  },
  {
    id: 'western-europe',
    name: 'Western Europe',
    description: 'UK, France, Germany, Benelux',
    bounds: { north: 54.0, south: 43.0, east: 15.0, west: -5.0 },
    sizeBytes: 1_200_000_000,
    downloadStatus: 'available',
    downloadedAt: null,
  },
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    description: 'Thailand, Vietnam, Cambodia, Malaysia, Indonesia',
    bounds: { north: 20.0, south: -8.0, east: 130.0, west: 95.0 },
    sizeBytes: 680_000_000,
    downloadStatus: 'available',
    downloadedAt: null,
  },
  {
    id: 'japan-korea',
    name: 'Japan & Korea',
    description: 'Japan, South Korea, major cities and transit',
    bounds: { north: 45.5, south: 31.0, east: 145.8, west: 124.0 },
    sizeBytes: 520_000_000,
    downloadStatus: 'available',
    downloadedAt: null,
  },
  {
    id: 'south-america-north',
    name: 'Northern South America',
    description: 'Colombia, Ecuador, Peru, Venezuela',
    bounds: { north: 12.5, south: -18.0, east: -59.0, west: -81.0 },
    sizeBytes: 390_000_000,
    downloadStatus: 'available',
    downloadedAt: null,
  },
];
