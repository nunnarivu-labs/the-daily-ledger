import { queryOptions } from '@tanstack/react-query';
import { fetchTotalRevenue } from '@/db/kpi';

export const totalRevenueQueryOptions = queryOptions({
  queryKey: ['kpi', 'totalRevenue'],
  queryFn: fetchTotalRevenue,
});
