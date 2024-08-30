'use client';

import { useMemo } from 'react';
import {
  MRT_Table, //import alternative sub-component if we do not want toolbars
  type MRT_ColumnDef,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { useMyMaterialReactTable } from '../ui/molecules/data-table/use-material-react-table';
import { listSurveys } from '~/server/data-layer/surveys';
import { type ListSurveysDto } from '~/server/db/types';

const useSurveys = () =>
  useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const result = await listSurveys();
      return result?.data;
    },
  });

export const SurveysTable = () => {
  const { data: surveys } = useSurveys();

  const router = useRouter();

  // const columns = useMemo<MRT_ColumnDef<NonNullable<typeof surveys>[number]>[]>(
  const columns = useMemo<MRT_ColumnDef<ListSurveysDto>[]>(
    () => [
      {
        header: 'Created At',
        accessorFn: (row) => row.createdAt.toLocaleString(),
      },
      {
        header: 'Email',
        accessorFn: (row) => row.createdBy.email,
      },
      {
        header: 'Name',
        accessorFn: (row) => row.name,
      },

      {
        header: 'Status',
        accessorFn: (row) => row.status,
      },
    ],
    []
  );

  const table = useMyMaterialReactTable({
    columns,
    data: surveys ?? [], //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        void router.push(`/survey/${row.original.slug}`); // Adjust the route as needed
      },
      style: {
        cursor: 'pointer', // Change cursor to pointer to indicate clickable row
      },
    }),
  });

  if (!surveys) return <div>Loading...</div>;

  return <MRT_Table table={table} />;
};
