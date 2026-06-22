import { parseCsv } from "@/lib/csv/parseCsv";
import { getReportById } from "@/lib/reports/registry";
import type { PipelineResult, RowValidationError } from "@/lib/reports/types";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function runReportPipeline(
  reportId: string,
  file: File,
): Promise<PipelineResult<unknown>> {
  const report = getReportById(reportId);
  if (!report) {
    throw new Error(`Unknown report type: ${reportId}`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      data: null,
      errors: [
        {
          row: 0,
          messages: ["File exceeds the 5 MB limit."],
        },
      ],
    };
  }

  const rawRows = await parseCsv(file);
  const errors: RowValidationError[] = [];
  const validRows: unknown[] = [];

  rawRows.forEach((row, index) => {
    const result = report.rowSchema.safeParse(row);
    if (!result.success) {
      errors.push({
        row: index + 2,
        messages: result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`,
        ),
      });
      return;
    }

    validRows.push(result.data);
  });

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: report.process(validRows),
    errors: null,
  };
}
