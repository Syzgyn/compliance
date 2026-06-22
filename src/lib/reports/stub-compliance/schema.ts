import { z } from "zod";

export const stubComplianceRowSchema = z.object({
  loan_id: z.string().min(1, "loan_id is required"),
  finding_type: z.string().min(1, "finding_type is required"),
  severity: z.enum(["Low", "Medium", "High", "Critical"], {
    message: "severity must be Low, Medium, High, or Critical",
  }),
  status: z.enum(["Open", "Closed"], {
    message: "status must be Open or Closed",
  }),
  review_date: z.string().min(1, "review_date is required"),
});

export type StubComplianceRow = z.infer<typeof stubComplianceRowSchema>;
