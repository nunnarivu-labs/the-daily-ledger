import {
  newUsersCountKpiCardQueryOptions,
  totalOrdersKpiCardQueryOptions,
  totalProfitKpiCardQueryOptions,
  totalRevenueKpiCardQueryOptions,
} from '@/query/query-options';
import { KpiCard } from '@/components/kpi-cards/kpi-card';

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <KpiCard
        description="Total Revenue"
        queryOptions={totalRevenueKpiCardQueryOptions}
        numberFormatter={(value) =>
          Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(value)
        }
      />
      <KpiCard
        description="Total Profit"
        queryOptions={totalProfitKpiCardQueryOptions}
        numberFormatter={(value) =>
          Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(value)
        }
      />
      <KpiCard
        description="Total Orders"
        queryOptions={totalOrdersKpiCardQueryOptions}
        numberFormatter={(value) =>
          Intl.NumberFormat('en', {
            style: 'decimal',
            notation: 'compact',
          }).format(value)
        }
      />
      <KpiCard
        description="New Users"
        queryOptions={newUsersCountKpiCardQueryOptions}
        numberFormatter={(value) =>
          Intl.NumberFormat('en', {
            style: 'decimal',
            notation: 'compact',
          }).format(value)
        }
      />
    </div>
  );
}
