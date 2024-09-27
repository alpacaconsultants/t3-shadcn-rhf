"use client";

import { type FC, useMemo } from "react";
import { MRT_Table, type MRT_ColumnDef } from "material-react-table";
import _ from "lodash";
import { type ColumnDef } from "@tanstack/react-table";
import { useMyMaterialReactTable } from "../ui/molecules/data-table/use-material-react-table";
import { DataTable } from "../data-table";
import { type InsightSummary } from "~/server/db/types";

interface InsightSummaryTableProps {
  insightsSummary: InsightSummary[];
}

const getPercentage = (value: number, total: number) =>
  `${((value / total) * 100).toFixed(0)}%`;

export const InsightSummaryTable: FC<InsightSummaryTableProps> = ({
  insightsSummary,
}) => {
  const totals = useMemo(
    () => ({
      negative: _.sumBy(insightsSummary, (v) => v.negative),
      neutral: _.sumBy(insightsSummary, (v) => v.neutral),
      positive: _.sumBy(insightsSummary, (v) => v.positive),
      total: _.sumBy(insightsSummary, (v) => v.total),
    }),
    [insightsSummary],
  );

  const columns = useMemo(
    () =>
      [
        {
          header: "Topic",
          accessorFn: (row) => row.topic ?? "N/A",
        },
        {
          header: "Negative",
          accessorFn: (row) => row.negative,
          footer: () => totals.negative,
        },
        {
          header: "Neutral",
          accessorFn: (row) => row.neutral,
          footer: () => totals.neutral,
        },
        {
          header: "Positive",
          accessorFn: (row) => row.positive,
          footer: () => totals.positive,
        },

        {
          header: "Negative %",
          accessorFn: (row) => getPercentage(row.negative, row.total),
          footer: () => getPercentage(totals.negative, totals.total),
        },
        {
          header: "Neutral %",
          accessorFn: (row) => getPercentage(row.neutral, row.total),
          footer: () => getPercentage(totals.neutral, totals.total),
        },
        {
          header: "Positive %",
          accessorFn: (row) => getPercentage(row.positive, row.total),
          footer: () => getPercentage(totals.positive, totals.total),
        },
        {
          header: "Total",
          accessorFn: (row) => row.total,
          footer: () => totals.total,
        },
      ] satisfies ColumnDef<InsightSummary>[],
    [totals.negative, totals.neutral, totals.positive, totals.total],
  );

  return <DataTable columns={columns} data={insightsSummary} />;
};
