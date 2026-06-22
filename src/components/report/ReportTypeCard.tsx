import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnyReportDefinition } from "@/lib/reports/types";
import { cn } from "@/lib/utils";

interface ReportTypeCardProps {
  report: AnyReportDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function ReportTypeCard({
  report,
  selected,
  onSelect,
}: ReportTypeCardProps) {
  return (
    <button type="button" onClick={onSelect} className="text-left">
      <Card
        className={cn(
          "transition-colors hover:border-primary/50",
          selected && "border-primary ring-2 ring-primary/20",
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{report.name}</CardTitle>
            {selected ? <Badge>Selected</Badge> : null}
          </div>
          <CardDescription>{report.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {report.csvSpec.columns.length} required columns
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
