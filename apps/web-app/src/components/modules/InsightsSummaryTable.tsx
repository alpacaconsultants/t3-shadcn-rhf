'use client';

import { type FC, useMemo } from 'react';
import { MRT_Table, type MRT_ColumnDef } from 'material-react-table';
import _ from 'lodash';
import { useMyMaterialReactTable } from '../ui/molecules/data-table/use-material-react-table';
import { type InsightSummary } from '~/server/db/types';

interface InsightSummaryTableProps {
  insightsSummary: InsightSummary[];
}

const getPercentage = (value: number, total: number) => `${((value / total) * 100).toFixed(0)}%`;

export const InsightSummaryTable: FC<InsightSummaryTableProps> = ({ insightsSummary }) => {
  const totals = useMemo(
    () => ({
      negative: _.sumBy(insightsSummary, (v) => v.negative),
      neutral: _.sumBy(insightsSummary, (v) => v.neutral),
      positive: _.sumBy(insightsSummary, (v) => v.positive),
      total: _.sumBy(insightsSummary, (v) => v.total),
    }),
    [insightsSummary]
  );

  // const totalss = useMemo(() => ({
  //   negative: _.sumBy(insightsSummary, v => v.negative),
  //   neutral: _.sumBy(insightsSummary, v => v.neutral),
  //   positive: _.sumBy(insightsSummary, v => v.positive),
  //   total: _.sumBy(insightsSummary, v => v.total),
  // }), [insightsSummary]);

  // const columns = useMemo<MRT_ColumnDef<NonNullable<typeof surveys>[number]>[]>(
  const columns = useMemo<MRT_ColumnDef<InsightSummary>[]>(
    () => [
      {
        header: 'Topic',
        accessorFn: (row) => row.topic ?? 'N/A',
      },
      {
        header: 'Negative',
        accessorFn: (row) => row.negative,
        Footer: () => totals.negative,
      },
      {
        header: 'Neutral',
        accessorFn: (row) => row.neutral,
        Footer: () => totals.neutral,
      },
      {
        header: 'Positive',
        accessorFn: (row) => row.positive,
        Footer: () => totals.positive,
      },

      {
        header: 'Negative %',
        accessorFn: (row) => getPercentage(row.negative, row.total),
        Footer: () => getPercentage(totals.negative, totals.total),
      },
      {
        header: 'Neutral %',
        accessorFn: (row) => getPercentage(row.neutral, row.total),
        Footer: () => getPercentage(totals.neutral, totals.total),
      },
      {
        header: 'Positive %',
        accessorFn: (row) => getPercentage(row.positive, row.total),
        Footer: () => getPercentage(totals.positive, totals.total),
      },
      {
        header: 'Total',
        accessorFn: (row) => row.total,
        Footer: () => totals.total,
      },
    ],
    [totals.negative, totals.neutral, totals.positive, totals.total]
  );

  const table = useMyMaterialReactTable({
    columns,
    data: insightsSummary ?? [], //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    muiTableBodyRowProps: () => ({
      // onClick: () => {
      //   void router.push(`/survey/${row.original.slug}`); // Adjust the route as needed
      // },

      style: {
        cursor: 'pointer', // Change cursor to pointer to indicate clickable row
      },
    }),

    initialState: {
      sorting: [
        {
          id: 'Total', // This should match the header or accessorKey of the Total column
          desc: true,
        },
      ],
    },
  });

  return <MRT_Table table={table} />;
};
