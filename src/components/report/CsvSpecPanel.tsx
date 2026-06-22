import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AnyReportDefinition } from "@/lib/reports/types";

interface CsvSpecPanelProps {
  report: AnyReportDefinition | null;
}

export function CsvSpecPanel({ report }: CsvSpecPanelProps) {
  if (!report) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expected CSV layout</CardTitle>
        <CardDescription>
          Upload a CSV with these column headers for {report.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Required</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.csvSpec.columns.map((column) => (
              <TableRow key={column.name}>
                <TableCell className="font-mono text-xs">{column.name}</TableCell>
                <TableCell>{column.description}</TableCell>
                <TableCell>
                  {column.required ? (
                    <Badge variant="secondary">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
