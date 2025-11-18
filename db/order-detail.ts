'use server';

import { sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { OrderDetailsData } from '@/types/order-details-data';

export const fetchOrderDetail = async (
  orderId: string,
): Promise<OrderDetailsData> => {
  const result = await db.execute(sql`
    SELECT o.id                       AS "id",
           o.created_at               AS "createdAt",
           o.status                   as "status",
           o.total_amount             AS "totalAmount",
           json_build_object(
             'firstName', u.first_name,
             'lastName', u.last_name,
             'email', u.email
           )                          AS "user",
           (SELECT json_agg(
                     json_build_object(
                       'quantity', oi.quantity,
                       'pricePerUnit', oi.price_per_unit,
                       'product', json_build_object(
                         'name', p.name,
                         'imageUrl', p.image_url
                                  )
                     )
                   )
            FROM order_items oi
                   JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = o.id) AS "items"
    FROM orders o
           INNER JOIN users u ON u.id = o.user_id
    WHERE o.id = ${orderId}
    GROUP BY o.id, u.id
  `);

  if (result.rows.length === 0) {
    throw new Error('Order not found');
  }

  return result.rows[0] as OrderDetailsData;
};
