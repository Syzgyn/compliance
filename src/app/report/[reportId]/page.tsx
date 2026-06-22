"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getReportById } from "@/lib/reports/registry";
import { loadReportData } from "@/lib/session/reportStorage";

const ReportRenderer = dynamic(
  () =>
    import("@/components/report/ReportRenderer").then(
      (module) => module.ReportRenderer,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground">Loading report preview…</p>
    ),
  },
);

export default function ReportPage() {
  const params = useParams<{ reportId: string }>();
  const router = useRouter();
  const reportId = params.reportId;
  const report = getReportById(reportId);
  const [data, setData] = useState<unknown | null>(() =>
    typeof window === "undefined" ? null : loadReportData(reportId),
  );

  useEffect(() => {
    setData(loadReportData(reportId));
  }, [reportId]);

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Alert>
          <AlertTitle>Unknown report</AlertTitle>
          <AlertDescription>
            No report type matches <code>{reportId}</code>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <Alert>
          <AlertTitle>No report data</AlertTitle>
          <AlertDescription>
            Upload a CSV on the home page to generate this report.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/")}>Back to upload</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/">Back</Link>
        </Button>
      </div>
      <ReportRenderer reportId={reportId} data={data} />
    </div>
  );
}
