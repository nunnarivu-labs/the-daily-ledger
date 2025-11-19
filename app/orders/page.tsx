'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import * as React from 'react';
import { OrdersTable } from '@/components/orders/orders-table';
import { OrderModal } from '@/components/order-modal';
import { use } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = use(searchParams);

  return (
    <SidebarInset>
      <SiteHeader header="Orders" />
      <OrdersTable />
      {params.orderId ? <OrderModal orderId={params.orderId} /> : null}
    </SidebarInset>
  );
}
