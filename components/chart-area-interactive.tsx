'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'; // <-- 1. Import YAxis
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useRangeFromParams } from '@/hooks/use-range-from-params';
import { salesProfitChartDataQueryOptions } from '@/query/query-options';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  Sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  Profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const range = useRangeFromParams();
  const query = useQuery(salesProfitChartDataQueryOptions(range));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales & Profit Trend</CardTitle>
        <CardDescription>
          Showing total sales and profit for the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {query.isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : query.isError ? (
            <div className="flex h-full w-full items-center justify-center bg-muted/50">
              <p className="text-destructive">Could not load chart data.</p>
            </div>
          ) : (
            <AreaChart data={query.data}>
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-Sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-Sales)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-Profit)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-Profit)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `$${Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)}`
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                    formatter={(value) => (
                      <span>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(value as number)}
                      </span>
                    )}
                  />
                }
              />
              <Area
                dataKey="Profit"
                type="natural"
                fill="url(#fillProfit)"
                stroke="var(--color-Profit)"
              />
              <Area
                dataKey="Sales"
                type="natural"
                fill="url(#fillSales)"
                stroke="var(--color-Sales)"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
