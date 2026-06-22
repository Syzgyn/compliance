"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import ReactPDFChart from "react-pdf-charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import type { StubComplianceReport } from "./processor";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    color: "#1e3a5f",
  },
  chartSection: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    flex: 1,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});

function formatGeneratedAt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function StubComplianceReportDocument({
  data,
}: {
  data: StubComplianceReport;
}) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Compliance Executive Brief</Text>
          <Text style={styles.subtitle}>
            Mortgage compliance findings summary for bank leadership
          </Text>
          <Text style={styles.subtitle}>
            Generated {formatGeneratedAt(data.generatedAt)}
          </Text>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total findings</Text>
            <Text style={styles.kpiValue}>{data.totalFindings}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Open</Text>
            <Text style={styles.kpiValue}>{data.openFindings}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Closed</Text>
            <Text style={styles.kpiValue}>{data.closedFindings}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Critical open</Text>
            <Text style={styles.kpiValue}>{data.criticalOpenFindings}</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Findings by severity</Text>
          <ReactPDFChart>
            <BarChart data={data.severityBreakdown} width={500} height={220}>
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ReactPDFChart>
        </View>

        <Text style={styles.sectionTitle}>Recent findings</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Loan ID</Text>
            <Text style={styles.tableHeaderCell}>Finding type</Text>
            <Text style={styles.tableHeaderCell}>Severity</Text>
            <Text style={styles.tableHeaderCell}>Status</Text>
            <Text style={styles.tableHeaderCell}>Review date</Text>
          </View>
          {data.recentFindings.map((finding) => (
            <View key={`${finding.loanId}-${finding.reviewDate}`} style={styles.tableRow}>
              <Text style={styles.tableCell}>{finding.loanId}</Text>
              <Text style={styles.tableCell}>{finding.findingType}</Text>
              <Text style={styles.tableCell}>{finding.severity}</Text>
              <Text style={styles.tableCell}>{finding.status}</Text>
              <Text style={styles.tableCell}>{finding.reviewDate}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>ComplianceBrief — Confidential</Text>
      </Page>
    </Document>
  );
}
