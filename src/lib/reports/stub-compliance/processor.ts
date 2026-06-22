import type { StubComplianceRow } from "./schema";

export interface SeverityBreakdown {
  label: string;
  count: number;
}

export interface FindingTypeBreakdown {
  type: string;
  count: number;
}

export interface RecentFinding {
  loanId: string;
  findingType: string;
  severity: string;
  status: string;
  reviewDate: string;
}

export interface StubComplianceReport {
  generatedAt: string;
  totalFindings: number;
  openFindings: number;
  closedFindings: number;
  criticalOpenFindings: number;
  severityBreakdown: SeverityBreakdown[];
  findingsByType: FindingTypeBreakdown[];
  recentFindings: RecentFinding[];
}

const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low"];

export function processStubComplianceRows(
  rows: StubComplianceRow[],
): StubComplianceReport {
  const openFindings = rows.filter((row) => row.status === "Open");
  const closedFindings = rows.filter((row) => row.status === "Closed");

  const severityCounts = new Map<string, number>();
  for (const severity of SEVERITY_ORDER) {
    severityCounts.set(severity, 0);
  }
  for (const row of rows) {
    severityCounts.set(row.severity, (severityCounts.get(row.severity) ?? 0) + 1);
  }

  const typeCounts = new Map<string, number>();
  for (const row of rows) {
    typeCounts.set(
      row.finding_type,
      (typeCounts.get(row.finding_type) ?? 0) + 1,
    );
  }

  const recentFindings = [...rows]
    .sort((a, b) => b.review_date.localeCompare(a.review_date))
    .slice(0, 8)
    .map((row) => ({
      loanId: row.loan_id,
      findingType: row.finding_type,
      severity: row.severity,
      status: row.status,
      reviewDate: row.review_date,
    }));

  return {
    generatedAt: new Date().toISOString(),
    totalFindings: rows.length,
    openFindings: openFindings.length,
    closedFindings: closedFindings.length,
    criticalOpenFindings: openFindings.filter((row) => row.severity === "Critical")
      .length,
    severityBreakdown: SEVERITY_ORDER.map((label) => ({
      label,
      count: severityCounts.get(label) ?? 0,
    })),
    findingsByType: [...typeCounts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    recentFindings,
  };
}
