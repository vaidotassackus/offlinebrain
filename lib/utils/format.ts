export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}
