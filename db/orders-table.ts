'use server';

import { db } from '@/db/index';
import { orders } from '@/db/schema';
import { count, desc } from 'drizzle-orm';
import { Order, OrderResult } from '@/types/orders';

export const fetchOrders = async (): Promise<OrderResult> => {
  const ordersPromise = db
    .select()
    .from(orders)
    .limit(50)
    .offset(0)
    .orderBy(desc(orders.createdAt));

  const countPromise = db.select({ value: count() }).from(orders);

  const [ordersResult, countResult] = await Promise.all([
    ordersPromise,
    countPromise,
  ]);

  return {
    count: countResult[0].value,
    orders: ordersResult.map<Order>((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: parseFloat(order.totalAmount),
      createdAt: order.createdAt,
    })),
  };
};
