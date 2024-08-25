/* eslint-disable arrow-body-style */
import { type MRT_RowData, type MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { type SxProps, type Theme } from '@mui/material';

const cellSx = {
  fontSize: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '14px',
    xl: '16px',
  },
  paddingRight: {
    xs: 0,
    sm: '5px',
  },
  paddingLeft: {
    xs: '3px',
    sm: '5px',
  },
  paddingTop: {
    xs: '5px',
    sm: '5px',
  },
  paddingBottom: {
    xs: '5px',
    sm: '5px',
  },
} as SxProps<Theme>;

export const useMyMaterialReactTable = <RowData extends MRT_RowData>({
  columns,
  data,
  // muiTableBodyCellProps: propsMuiTableBodyCellProps,
  // muiTableHeadCellProps,
  // muiTableFooterCellProps,
  ...rest
}: MRT_TableOptions<RowData>) => {
  return useMaterialReactTable({
    columns,
    data,
    // enableBottomToolbar: false,
    // muiTableBodyCellProps: (p) => {
    //   const propsOveride = typeof propsMuiTableBodyCellProps === 'function' ? propsMuiTableBodyCellProps(p) : propsMuiTableBodyCellProps;
    //   return {
    //     sx: cellSx,
    //     ...propsOveride,
    //   };
    // },
    // muiTableHeadCellProps: {
    //   sx: cellSx,
    //   ...muiTableHeadCellProps,
    // },
    // muiTableFooterCellProps: {
    //   sx: cellSx,
    //   ...muiTableFooterCellProps,
    // },
    // enableDensityToggle: false,
    // enableFullScreenToggle: false,
    // enablePagination: false,
    // enableStickyHeader: true,
    // enableColumnFilters: false,
    // enableSorting: false,
    // enableHiding: false,
    // enableColumnActions: false,
    // enableGlobalFilter: false,
    // enableTopToolbar: false,
    ...rest,
  } satisfies MRT_TableOptions<RowData>);
};
