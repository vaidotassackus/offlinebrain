export type RegionDownloadStatus = 'available' | 'downloading' | 'downloaded' | 'update_available';

export interface MapRegion {
  id: string;
  name: string;
  description: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  sizeBytes: number;
  downloadStatus: RegionDownloadStatus;
  downloadedAt: number | null;
}
