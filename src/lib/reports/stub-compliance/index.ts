import { processStubComplianceRows, type StubComplianceReport } from "./processor";
import { StubComplianceReportDocument } from "./ReportDocument";
import { stubComplianceRowSchema, type StubComplianceRow } from "./schema";
import type { ReportDefinition } from "../types";

export const stubComplianceReport: ReportDefinition<
  StubComplianceRow,
  StubComplianceReport
> = {
  id: "stub-compliance",
  name: "Compliance Executive Brief",
  description:
    "Summarizes mortgage compliance findings for bank leadership, including severity breakdown and open critical items.",
  csvSpec: {
    columns: [
      {
        name: "loan_id",
        description: "Unique loan identifier",
        required: true,
      },
      {
        name: "finding_type",
        description: "Compliance finding category (e.g. TRID Disclosure)",
        required: true,
      },
      {
        name: "severity",
        description: "Low, Medium, High, or Critical",
        required: true,
      },
      {
        name: "status",
        description: "Open or Closed",
        required: true,
      },
      {
        name: "review_date",
        description: "Date the finding was reviewed (YYYY-MM-DD)",
        required: true,
      },
    ],
  },
  rowSchema: stubComplianceRowSchema,
  process: processStubComplianceRows,
  ReportDocument: StubComplianceReportDocument,
};
