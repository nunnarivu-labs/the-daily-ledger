'use client';

import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import { DateRangePicker } from '@/components/date-range-picker';
import { redirect } from 'next/navigation';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { use } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = use(searchParams);

  if (!params.from || !params.to) {
    const today = endOfDay(new Date());
    const threeMonthsAgo = subDays(today, 90);

    const newSearchParams = new URLSearchParams({
      from: startOfDay(threeMonthsAgo).getTime().toString(),
      to: today.getTime().toString(),
    });

    return redirect(`?${newSearchParams}`);
  }

  return (
    <SidebarInset>
      <SiteHeader header="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
              <DateRangePicker />
            </div>
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
