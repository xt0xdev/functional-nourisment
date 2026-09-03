export function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatEventDate(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" });
}
