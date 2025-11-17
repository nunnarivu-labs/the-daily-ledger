'use server';

import { db } from '@/db/index';
import { orders } from '@/db/schema';
import { count, desc } from 'drizzle-orm';
import { Order, OrderResult } from '@/types/orders';
import { OrdersTableFetchDataQuery } from '@/types/orders-table-fetch-data-query';

export const fetchOrders = async (
  query: OrdersTableFetchDataQuery,
): Promise<OrderResult> => {
  const ordersPromise = db
    .select()
    .from(orders)
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(desc(orders.createdAt));

  const countPromise = db.select({ value: count() }).from(orders);

  const [ordersResult, countResult] = await Promise.all([
    ordersPromise,
    countPromise,
  ]);

  return {
    paging: {
      count: countResult[0].value,
      limit: query.limit,
      offset: query.offset,
    },
    orders: ordersResult.map<Order>((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: parseFloat(order.totalAmount),
      createdAt: order.createdAt,
    })),
  };
};
