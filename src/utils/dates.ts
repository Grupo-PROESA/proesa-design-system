const TZ = "America/Mexico_City";

export function formatDateMx(input: Date | string | number): string {
  const d = new Date(input);
  return d.toLocaleDateString("es-MX", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTimeMx(input: Date | string | number): string {
  const d = new Date(input);
  const date = d.toLocaleDateString("es-MX", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("es-MX", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
}

export function todayMxISO(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("es-MX", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatRelative(input: Date | string | number): string {
  const d = new Date(input);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;

  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "ayer";
  if (diffD < 7) return `hace ${diffD}d`;

  return d.toLocaleDateString("es-MX", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
  });
}
