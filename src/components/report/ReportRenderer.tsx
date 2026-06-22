"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import { Button } from "@/components/ui/button";
import { getReportById } from "@/lib/reports/registry";

interface ReportRendererProps {
  reportId: string;
  data: unknown;
}

export function ReportRenderer({ reportId, data }: ReportRendererProps) {
  const report = getReportById(reportId);

  if (!report) {
    return (
      <p className="text-sm text-muted-foreground">Unknown report type.</p>
    );
  }

  const ReportDocument = report.ReportDocument;
  const document = <ReportDocument data={data} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{report.name}</h2>
          <p className="text-sm text-muted-foreground">
            Preview and download the generated PDF report.
          </p>
        </div>
        <PDFDownloadLink
          document={document}
          fileName={`${reportId}-report.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? "Preparing…" : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <PDFViewer width="100%" height={800} showToolbar>
          {document}
        </PDFViewer>
      </div>
    </div>
  );
}
