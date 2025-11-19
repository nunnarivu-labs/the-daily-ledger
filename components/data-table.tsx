'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWithoutDiv,
} from '@/components/ui/table';
import { useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';

const SkeletonRow = ({
  visibleColumnsSizes,
  style,
}: {
  visibleColumnsSizes: number[];
  style: React.CSSProperties;
}) => {
  return (
    <TableRow style={style}>
      {visibleColumnsSizes.map((size, index) => (
        <TableCell key={index} style={{ width: size }}>
          <Skeleton className="h-6 w-[80%]" />
        </TableCell>
      ))}
    </TableRow>
  );
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  onScrollBeyondIndex: (virtualIndexes: number[]) => void;
  defaultHiddenColumnIds?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  onScrollBeyondIndex,
  defaultHiddenColumnIds,
}: DataTableProps<TData, TValue>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      !defaultHiddenColumnIds
        ? {}
        : Object.fromEntries(defaultHiddenColumnIds.map((id) => [id, false])),
  );

  const table = useReactTable({
    rowCount,
    data,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,
    isScrollingResetDelay: 500,
    onChange: (instance) => {
      if (!instance.isScrolling) {
        onScrollBeyondIndex(instance.getVirtualIndexes());
      }
    },
  });

  const virtualItems = virtualizer.getVirtualItems();

  const visibleColumnsSizes = useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.getSize());
  }, [table]);

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' &&
                  column.getCanHide(),
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  <>{column.columnDef.header}</>
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
            <TableHeader className="top-0 z-10 bg-background">
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
              {rows.length ? (
                virtualItems.map((virtualRow, index) => {
                  const row = rows[virtualRow.index];

                  const style = {
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  };

                  if (!row || !row.original) {
                    return (
                      <SkeletonRow
                        key={virtualRow.index}
                        visibleColumnsSizes={visibleColumnsSizes}
                        style={style}
                      />
                    );
                  }

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
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
    </>
  );
}
