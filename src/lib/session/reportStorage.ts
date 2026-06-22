const STORAGE_PREFIX = "compliance-report:";

export function saveReportData(reportId: string, data: unknown) {
  sessionStorage.setItem(
    `${STORAGE_PREFIX}${reportId}`,
    JSON.stringify(data),
  );
}

export function loadReportData(reportId: string): unknown | null {
  const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${reportId}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function clearReportData(reportId: string) {
  sessionStorage.removeItem(`${STORAGE_PREFIX}${reportId}`);
}
