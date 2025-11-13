'use server';

import { db } from '@/db/index';
import { orders, users } from '@/db/schema';
import { sql, sum, count, gte, and, lte } from 'drizzle-orm';
import { RangeNumber } from '@/types/range';

export const fetchTotalRevenue = async (range: RangeNumber) => {
  const result = await db
    .select({ value: sum(orders.totalAmount) })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, new Date(range.from)),
        lte(orders.createdAt, new Date(range.to)),
      ),
    );

  return parseFloat((result?.[0]?.value as string) ?? '0');
};

export const fetchTotalProfit = async (range: RangeNumber) => {
  const result = await db.execute(
    sql`SELECT SUM((oi.price_per_unit - p.cost) * oi.quantity) as totalProfit
        FROM order_items oi
               JOIN products p on oi.product_id = p.id
               JOIN
             orders o ON oi.order_id = o.id
        WHERE o.created_at >= ${new Date(range.from)}
          AND o.created_at <= ${new Date(range.to)}`,
  );

  return parseFloat((result.rows[0].totalprofit as string) ?? '0');
};

export const fetchTotalOrdersCount = async (range: RangeNumber) => {
  const result = await db
    .select({ value: count() })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, new Date(range.from)),
        lte(orders.createdAt, new Date(range.to)),
      ),
    );
  return result[0].value;
};

export const fetchNewUsersCount = async (range: RangeNumber) => {
  const result = await db
    .select({ value: count() })
    .from(users)
    .where(
      and(
        gte(users.createdAt, new Date(range.from)),
        lte(users.createdAt, new Date(range.to)),
      ),
    );
  return result[0].value;
};
