'use server';

import { db } from '@/db/index';
import { sql } from 'drizzle-orm';
import { RangeNumber, Range } from '@/types/range';
import { differenceInDays, subDays } from 'date-fns';
import { KpiResult } from '@/types/kpi-result';

const getRangeDifferenceAndPreviousRange = (rangeNumber: RangeNumber) => {
  const range = {
    from: new Date(rangeNumber.from),
    to: new Date(rangeNumber.to),
  };

  const difference = differenceInDays(range.to, range.from);

  const previousRange: Range = {
    from: subDays(rangeNumber.from, difference + 1),
    to: subDays(rangeNumber.to, difference + 1),
  };

  return { range, difference, previousRange };
};

const getKpiResult = (
  currentValue: number,
  previousValue: number,
): KpiResult => {
  let changePercentage = 0;

  if (previousValue !== 0) {
    changePercentage = ((currentValue - previousValue) / previousValue) * 100;
  } else if (currentValue > 0) {
    changePercentage = 100;
  }

  return { value: currentValue, changePercentage };
};

export const fetchTotalRevenue = async (
  rangeNumber: RangeNumber,
): Promise<KpiResult> => {
  const { range, previousRange } =
    getRangeDifferenceAndPreviousRange(rangeNumber);

  const queryResult = await db.execute(sql`
    SELECT SUM(CASE
                 WHEN created_at >= ${previousRange.from} AND created_at <= ${previousRange.to} THEN total_amount
                 ELSE 0 END) AS "previousValue",
           SUM(CASE
                 WHEN created_at >= ${range.from} AND created_at <= ${range.to}
                   THEN total_amount
                 ELSE 0 END) AS "currentValue"
    FROM orders
    WHERE created_at >= ${previousRange.from}
      AND created_at <= ${range.to};
  `);

  return getKpiResult(
    parseFloat(queryResult.rows[0].currentValue as string),
    parseFloat(queryResult.rows[0].previousValue as string),
  );
};

export const fetchTotalProfit = async (
  rangeNumber: RangeNumber,
): Promise<KpiResult> => {
  const { range, previousRange } =
    getRangeDifferenceAndPreviousRange(rangeNumber);

  const result = await db.execute(
    sql`SELECT SUM(CASE
                   WHEN o.created_at >= ${previousRange.from} AND o.created_at <= ${previousRange.to}
                     THEN ((oi.price_per_unit - p.cost) * oi.quantity)
                   ELSE 0 END) AS "previousValue",
             SUM(CASE
                   WHEN o.created_at >= ${range.from} AND o.created_at <= ${range.to}
                     THEN ((oi.price_per_unit - p.cost) * oi.quantity)
                   ELSE 0 END) AS "currentValue"
      FROM order_items oi
             JOIN products p on oi.product_id = p.id
             JOIN
           orders o ON oi.order_id = o.id
      WHERE o.created_at >= ${previousRange.from}
        AND o.created_at <= ${range.to}`,
  );

  return getKpiResult(
    parseFloat(result.rows[0].currentValue as string),
    parseFloat(result.rows[0].previousValue as string),
  );
};

export const fetchTotalOrdersCount = async (
  rangeNumber: RangeNumber,
): Promise<KpiResult> => {
  const { range, previousRange } =
    getRangeDifferenceAndPreviousRange(rangeNumber);

  const result = await db.execute(sql`
    SELECT SUM(CASE WHEN created_at >= ${previousRange.from} AND created_at <= ${previousRange.to} THEN 1 ELSE 0 END) AS "previousValue",
           SUM(CASE WHEN created_at >= ${range.from} AND created_at <= ${range.to} THEN 1 ELSE 0 END)                                                                                                      AS "currentValue"
    FROM orders
    WHERE created_at >= ${previousRange.from}
      AND created_at <= ${range.to}
  `);

  return getKpiResult(
    parseInt(result.rows[0].currentValue as string),
    parseInt(result.rows[0].previousValue as string),
  );
};

export const fetchNewUsersCount = async (
  rangeNumber: RangeNumber,
): Promise<KpiResult> => {
  const { range, previousRange } =
    getRangeDifferenceAndPreviousRange(rangeNumber);

  const result =
    await db.execute(sql`SELECT SUM(CASE WHEN created_at >= ${previousRange.from} AND created_at <= ${previousRange.to} THEN 1 ELSE 0 END) AS "previousValue",
             SUM(CASE WHEN created_at >= ${range.from} AND created_at <= ${range.to} THEN 1 ELSE 0 END)                 AS "currentValue"
      FROM users
      WHERE created_at >= ${previousRange.from}
        AND created_at <= ${range.to}`);

  return getKpiResult(
    parseInt(result.rows[0].currentValue as string),
    parseInt(result.rows[0].previousValue as string),
  );
};
