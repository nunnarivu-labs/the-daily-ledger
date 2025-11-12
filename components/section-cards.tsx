import { TotalRevenueKpiCard } from '@/components/kpi-cards/total-revenue-kpi-card';
import { TotalProfitKpiCard } from '@/components/kpi-cards/total-profit-kpi-card';
import { TotalOrdersKpiCard } from '@/components/kpi-cards/total-orders-kpi-card';
import { NewUsersKpiCard } from '@/components/kpi-cards/new-users-kpi-card';

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <TotalRevenueKpiCard />
      <TotalProfitKpiCard />
      <TotalOrdersKpiCard />
      <NewUsersKpiCard />
    </div>
  );
}
