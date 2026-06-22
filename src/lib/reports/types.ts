import type { ComponentType } from "react";
import type { z } from "zod";

export interface CsvColumnSpec {
  name: string;
  description: string;
  required: boolean;
}

export interface ReportDefinition<TRow, TReport> {
  id: string;
  name: string;
  description: string;
  csvSpec: { columns: CsvColumnSpec[] };
  rowSchema: z.ZodType<TRow>;
  process: (rows: TRow[]) => TReport;
  ReportDocument: ComponentType<{ data: TReport }>;
}

export interface AnyReportDefinition {
  id: string;
  name: string;
  description: string;
  csvSpec: { columns: CsvColumnSpec[] };
  rowSchema: z.ZodType;
  process: (rows: unknown[]) => unknown;
  ReportDocument: ComponentType<{ data: unknown }>;
}

export interface RowValidationError {
  row: number;
  messages: string[];
}

export interface PipelineSuccess<TReport> {
  data: TReport;
  errors: null;
}

export interface PipelineFailure {
  data: null;
  errors: RowValidationError[];
}

export type PipelineResult<TReport> = PipelineSuccess<TReport> | PipelineFailure;
