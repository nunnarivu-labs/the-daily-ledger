import { db } from '@/db/index';
import { orders, users } from '@/db/schema';
import { sql, sum, count } from 'drizzle-orm';

export const fetchTotalRevenue = async () => {
  const result = await db
    .select({ value: sum(orders.totalAmount) })
    .from(orders);
  return parseFloat((result?.[0]?.value as string) ?? '0');
};

export const fetchTotalProfit = async () => {
  const result = await db.execute(
    sql`SELECT SUM((oi.price_per_unit - p.cost) * oi.quantity) as totalProfit
        FROM order_items oi
               JOIN products p on oi.product_id = p.id`,
  );

  return parseFloat((result.rows[0].totalprofit as string) ?? '0');
};

export const fetchTotalOrdersCount = async () => {
  const result = await db.select({ value: count() }).from(orders);
  return result[0].value;
};

export const fetchNewUsersCount = async () => {
  const result = await db.select({ value: count() }).from(users);
  return result[0].value;
};
