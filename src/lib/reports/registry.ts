import { stubComplianceReport } from "./stub-compliance";
import type { AnyReportDefinition, ReportDefinition } from "./types";

function toAnyReportDefinition<TRow, TReport>(
  definition: ReportDefinition<TRow, TReport>,
): AnyReportDefinition {
  return definition as unknown as AnyReportDefinition;
}

const reportDefinitions: AnyReportDefinition[] = [
  toAnyReportDefinition(stubComplianceReport),
];

export function listReports(): AnyReportDefinition[] {
  return reportDefinitions;
}

export function getReportById(id: string): AnyReportDefinition | undefined {
  return reportDefinitions.find((report) => report.id === id);
}
