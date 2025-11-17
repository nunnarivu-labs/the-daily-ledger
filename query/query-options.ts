import {
  fetchNewUsersCount,
  fetchTotalOrdersCount,
  fetchTotalProfit,
  fetchTotalRevenue,
} from '@/db/kpi';
import { queryOptions } from '@tanstack/react-query';
import { Range } from '@/types/range';
import { fetchSalesProfitChartData } from '@/db/chart';
import { SalesProfitChartData } from '@/types/sales-profit-chart-data';
import { fetchOrders } from '@/db/orders-table';
import { OrdersTableFetchDataQuery } from '@/types/orders-table-fetch-data-query';

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

export const salesProfitChartDataQueryOptions = (range: Range) =>
  queryOptions({
    queryKey: ['chart', 'salesProfit', range],
    queryFn: () =>
      fetchSalesProfitChartData({
        from: range.from.getTime(),
        to: range.to.getTime(),
      }),
    select: (data): SalesProfitChartData[] =>
      data.map((row) => ({
        date: row.date,
        Sales: parseFloat(row.totalSales),
        Profit: parseFloat(row.totalProfit),
      })),
  });

export const fetchOrdersQueryOptions = (query: OrdersTableFetchDataQuery) =>
  queryOptions({
    queryKey: ['table', 'orders', query],
    queryFn: () => fetchOrders(query),
  });
