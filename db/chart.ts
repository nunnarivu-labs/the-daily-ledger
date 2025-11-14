'use server';

import { RangeNumber } from '@/types/range';
import { sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { SalesProfitChartDataDB } from '@/types/sales-profit-chart-data';

export const fetchSalesProfitChartData = async (
  range: RangeNumber,
): Promise<SalesProfitChartDataDB[]> => {
  const result = await db.execute(
    sql`SELECT date_trunc('day', o.created_at) as date, sum(o.total_amount) as "totalSales", sum((oi.price_per_unit - p.cost) * oi.quantity) as "totalProfit" FROM orders o 
  INNER JOIN order_items oi ON oi.order_id = o.id 
  INNER JOIN products p on oi.product_id = p.id
  WHERE o.created_at >= ${new Date(range.from)} AND o.created_at <= ${new Date(range.to)} GROUP BY date ORDER BY date`,
  );

  return result.rows as SalesProfitChartDataDB[];
};
