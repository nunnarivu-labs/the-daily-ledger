'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrdersQueryOptions } from '@/query/query-options';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/columns';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading

export default function Page() {
  const ordersQuery = useQuery(fetchOrdersQueryOptions());

  return (
    <SidebarInset>
      <SiteHeader header="Orders" />
      {/* --- THIS IS THE KEY LAYOUT CHANGE --- */}
      {/* This outer div is now the main content area.
          It's a flex column that takes up all remaining space (flex-1).
          'h-0' is a flexbox trick to make it work reliably in all browsers. */}
      <div className="flex h-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* The DataTable now lives directly inside this growing container */}
        {ordersQuery.status === 'pending' ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : ordersQuery.status === 'error' ? (
          <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted/50">
            <p className="text-destructive">Failed to load orders.</p>
          </div>
        ) : (
          <DataTable
            data={ordersQuery.data.orders}
            columns={columns}
            rowCount={ordersQuery.data.count}
          />
        )}
      </div>
    </SidebarInset>
  );
}
