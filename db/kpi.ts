import { db } from '@/db/index';
import { orders } from '@/db/schema';
import { sum } from 'drizzle-orm';

export const fetchTotalRevenue = async () =>
  await db.select({ value: sum(orders.totalAmount) }).from(orders);
