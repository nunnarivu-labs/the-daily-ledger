'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWithoutDiv,
} from '@/components/ui/table';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
}

const SkeletonRow = <TData, TValue>({
  columns,
  style,
}: {
  columns: ColumnDef<TData, TValue>[];
  style: React.CSSProperties;
}) => {
  return (
    <TableRow style={style}>
      {columns.map((column, index) => (
        <TableCell key={index} style={{ width: column.size }}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    rowCount,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 20,
    isScrollingResetDelay: 1000,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="rounded-md border h-[85vh] w-full overflow-auto"
    >
      <div
        data-slot="table-container"
        className="overflow-x-auto"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <TableWithoutDiv>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {virtualItems.length ? (
              virtualItems.map((virtualRow, index) => {
                const row = rows[virtualRow.index];

                const style = {
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${
                    virtualRow.start - index * virtualRow.size
                  }px)`,
                };

                if (!row) {
                  return (
                    <SkeletonRow
                      key={virtualRow.index}
                      columns={columns}
                      style={style}
                    />
                  );
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    // className="hover:bg-muted/50 even:bg-muted/25"
                    style={style}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableWithoutDiv>
      </div>
    </div>
  );
}
