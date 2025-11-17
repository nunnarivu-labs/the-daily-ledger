'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import * as React from 'react';
import { OrdersTable } from '@/components/tables/orders-table';

export default function Page() {
  return (
    <SidebarInset>
      <SiteHeader header="Orders" />
      <OrdersTable />
    </SidebarInset>
  );
}
