'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import * as React from 'react';
import { OrdersTable } from '@/components/tables/orders-table';
import { useSearchParams } from 'next/navigation';
import { OrderModal } from '@/components/order-modal';

export default function Page() {
  const searchParams = useSearchParams();

  return (
    <SidebarInset>
      <SiteHeader header="Orders" />
      <OrdersTable />
      {searchParams.has('orderId') ? (
        <OrderModal orderId={searchParams.get('orderId')!} />
      ) : null}
    </SidebarInset>
  );
}
