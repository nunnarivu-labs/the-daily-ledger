import {
  fetchNewUsersCount,
  fetchTotalOrdersCount,
  fetchTotalProfit,
  fetchTotalRevenue,
} from '@/db/kpi';
import { queryOptions } from '@tanstack/react-query';
import { Range } from '@/types/range';

export const newUsersCountKpiCardQueryOptions = (range: Range) =>
  queryOptions({
    queryKey: ['kpi', 'newUsersCount', range],
    queryFn: () =>
      fetchNewUsersCount({
        from: range.from.getTime(),
        to: range.to.getTime(),
      }),
  });

export const totalOrdersKpiCardQueryOptions = (range: Range) =>
  queryOptions({
    queryKey: ['kpi', 'totalOrders', range],
    queryFn: () =>
      fetchTotalOrdersCount({
        from: range.from.getTime(),
        to: range.to.getTime(),
      }),
  });

export const totalProfitKpiCardQueryOptions = (range: Range) =>
  queryOptions({
    queryKey: ['kpi', 'totalProfit', range],
    queryFn: () =>
      fetchTotalProfit({
        from: range.from.getTime(),
        to: range.to.getTime(),
      }),
  });

export const totalRevenueKpiCardQueryOptions = (range: Range) =>
  queryOptions({
    queryKey: ['kpi', 'totalRevenue', range],
    queryFn: () =>
      fetchTotalRevenue({
        from: range.from.getTime(),
        to: range.to.getTime(),
      }),
  });
