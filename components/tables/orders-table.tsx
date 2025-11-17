import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/columns';
import * as React from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchOrdersQueryOptions } from '@/query/query-options';
import { useCallback, useMemo } from 'react';
import { getOffsetFromIndex } from '@/utils/table-utils';
import { Order } from '@/types/orders';

const LIMIT = 50;

export function OrdersTable() {
  const [offsets, setOffsets] = React.useState(new Set([0]));

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
      if (!virtualIndexes.length) return;
      const newOffsets: number[] = [];
      newOffsets.push(getOffsetFromIndex(virtualIndexes[0], LIMIT));

      let nextIndex = virtualIndexes[LIMIT - (virtualIndexes[0] % LIMIT)];

      while (nextIndex) {
        newOffsets.push(getOffsetFromIndex(nextIndex, LIMIT));
        nextIndex = virtualIndexes[nextIndex + LIMIT];
      }

      const hasNewOffsets = newOffsets.some((offset) => !offsets.has(offset));

      if (hasNewOffsets) {
        newOffsets
          .filter((offset) => !offsets.has(offset))
          .forEach((offset) => offsets.add(offset));

        setOffsets(new Set([...offsets]));
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
        />
      )}
    </div>
  );
}
