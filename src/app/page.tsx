"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CsvSpecPanel } from "@/components/report/CsvSpecPanel";
import { ReportTypeCard } from "@/components/report/ReportTypeCard";
import { CsvUploadZone } from "@/components/upload/CsvUploadZone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { runReportPipeline } from "@/hooks/useReportPipeline";
import { listReports } from "@/lib/reports/registry";
import { saveReportData } from "@/lib/session/reportStorage";

export default function HomePage() {
  const router = useRouter();
  const reports = useMemo(() => listReports(), []);
  const [selectedReportId, setSelectedReportId] = useState(
    reports[0]?.id ?? "",
  );
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    { row: number; messages: string[] }[] | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  const selectedReport =
    reports.find((report) => report.id === selectedReportId) ?? null;

  async function handleGenerate() {
    if (!file || !selectedReportId) {
      return;
    }

    setIsProcessing(true);
    setErrors(null);
    setPipelineError(null);

    try {
      const result = await runReportPipeline(selectedReportId, file);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      saveReportData(selectedReportId, result.data);
      router.push(`/report/${selectedReportId}`);
    } catch (error) {
      setPipelineError(
        error instanceof Error ? error.message : "Failed to process CSV.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          ComplianceBrief
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Mortgage compliance reporting
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload compliance CSV exports, validate the layout, and generate
          executive-ready PDF reports for bank leadership.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">1. Choose a report type</h2>
          <p className="text-sm text-muted-foreground">
            Each report type has its own CSV layout and processing rules.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <ReportTypeCard
              key={report.id}
              report={report}
              selected={report.id === selectedReportId}
              onSelect={() => setSelectedReportId(report.id)}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>2. Upload CSV</CardTitle>
            <CardDescription>
              Processing happens entirely in your browser. No data is sent to a
              server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CsvUploadZone
              file={file}
              onFileChange={setFile}
              disabled={isProcessing}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!file || !selectedReportId || isProcessing}
              >
                {isProcessing ? "Processing…" : "Generate report"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/samples/stub-compliance-sample.csv" download>
                  Download sample CSV
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <CsvSpecPanel report={selectedReport} />
      </section>

      {pipelineError ? (
        <Alert>
          <AlertTitle>Processing failed</AlertTitle>
          <AlertDescription>{pipelineError}</AlertDescription>
        </Alert>
      ) : null}

      {errors ? (
        <Alert>
          <AlertTitle>CSV validation errors</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {errors.map((error) => (
                <li key={`${error.row}-${error.messages.join("-")}`}>
                  Row {error.row}: {error.messages.join("; ")}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
