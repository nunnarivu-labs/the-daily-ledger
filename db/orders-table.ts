'use server';

import { db } from '@/db/index';
import { orders } from '@/db/schema';
import { count, sql } from 'drizzle-orm';
import { Order, OrderResult } from '@/types/orders';
import { OrdersTableFetchDataQuery } from '@/types/orders-table-fetch-data-query';

export const fetchOrders = async (
  query: OrdersTableFetchDataQuery,
): Promise<OrderResult> => {
  const ordersPromise = db.execute(sql`
    SELECT o.id                                                                                    AS "id",
           o.status                                                                                AS "status",
           o.total_amount                                                                          AS "totalAmount",
           o.created_at                                                                            AS "createdAt",
           json_build_object('firstName', u.first_name, 'lastName', u.last_name, 'email', u.email) AS "user"
    FROM orders o
           LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT ${query.limit} OFFSET ${query.offset}
  `);

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
    orders: ordersResult.rows as Order[],
  };
};
