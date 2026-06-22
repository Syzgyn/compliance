# ComplianceBrief

Client-side mortgage compliance reporting. Upload a CSV, validate its layout, run report-specific processing, and preview or download an executive PDF — all in the browser.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI components
- Papa Parse (CSV parsing)
- Zod (row validation)
- `@react-pdf/renderer` (PDF preview + download)
- Recharts + `react-pdf-charts` (charts inside PDF reports)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), select a report type, upload a CSV, and generate a report.

A sample CSV is available at [`public/samples/stub-compliance-sample.csv`](public/samples/stub-compliance-sample.csv).

## Architecture

Each report type is a plugin registered in [`src/lib/reports/registry.ts`](src/lib/reports/registry.ts). A report module provides:

1. **`schema.ts`** — Zod schema for expected CSV columns
2. **`processor.ts`** — pure functions that transform validated rows into report data
3. **`ReportDocument.tsx`** — a single `@react-pdf/renderer` `Document` used for both in-browser preview (`PDFViewer`) and download (`PDFDownloadLink`)
4. **`index.ts`** — exports a `ReportDefinition` wired into the registry

Charts inside PDF reports use Recharts wrapped with `react-pdf-charts`. **Pin Recharts to v2** — v3 is not supported by `react-pdf-charts`.

## Adding a new report type

1. Create `src/lib/reports/<report-id>/` with `schema.ts`, `processor.ts`, `ReportDocument.tsx`, and `index.ts`.
2. Register the report in `src/lib/reports/registry.ts`.
3. Add a sample CSV under `public/samples/`.
4. No changes are needed to upload, routing, or `ReportRenderer` — they are report-agnostic.

## Client-only constraints

- All CSV parsing and processing runs in the browser.
- Report preview and PDF export require client components (`'use client'` and dynamic imports with `ssr: false`).
- Processed report data is stored in `sessionStorage` between the home page and `/report/[reportId]`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
