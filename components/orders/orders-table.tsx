import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table';
import { useOrdersColumns } from '@/components/orders/use-orders-columns';
import * as React from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchOrdersQueryOptions } from '@/query/query-options';
import { useCallback, useMemo } from 'react';
import { getOffsetFromIndex } from '@/utils/table-utils';
import { Order } from '@/types/orders';

const LIMIT = 50;

export function OrdersTable() {
  const [offsets, setOffsets] = React.useState(new Set([0]));

  const columns = useOrdersColumns();

  const ordersQueries = useQueries({
    queries: Array.from(offsets).map((offset) =>
      fetchOrdersQueryOptions({ offset, limit: LIMIT }),
    ),
  });

  const orders = useMemo((): Order[] => {
    const successQueries = ordersQueries.filter((query) => query.isSuccess);

    if (successQueries.length === 0) return [];

    const results: Order[] = [];

    successQueries.forEach((query) => {
      let index = query.data.paging.offset;
      query.data.orders.forEach((order) => (results[index++] = order));
    });

    return results;
  }, [ordersQueries]);

  const onScrollBeyondIndex = useCallback(
    (virtualIndexes: number[]) => {
      if (virtualIndexes.length === 0) {
        return;
      }

      const startOffset = getOffsetFromIndex(virtualIndexes[0], LIMIT);
      const endOffset = getOffsetFromIndex(
        virtualIndexes[virtualIndexes.length - 1],
        LIMIT,
      );

      const newOffsets = new Set<number>();

      for (let i = startOffset; i <= endOffset; i += LIMIT) {
        if (!offsets.has(i)) {
          newOffsets.add(i);
        }
      }

      if (newOffsets.size > 0) {
        setOffsets((prevOffsets) => new Set([...prevOffsets, ...newOffsets]));
      }
    },
    [offsets],
  );

  const firstQuery = ordersQueries[0];

  return (
    <div className="flex h-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {firstQuery.status === 'pending' ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : firstQuery.status === 'error' ? (
        <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted/50">
          <p className="text-destructive">Failed to load orders.</p>
        </div>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          rowCount={firstQuery.data.paging.count}
          onScrollBeyondIndex={onScrollBeyondIndex}
          defaultHiddenColumnIds={['fullName', 'email']}
        />
      )}
    </div>
  );
}
