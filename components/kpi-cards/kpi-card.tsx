import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useRangeFromParams } from '@/hooks/use-range-from-params';
import { Badge } from '@/components/ui/badge';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Range } from '@/types/range';
import {
  newUsersCountKpiCardQueryOptions,
  totalOrdersKpiCardQueryOptions,
  totalProfitKpiCardQueryOptions,
  totalRevenueKpiCardQueryOptions,
} from '@/query/query-options';

type KpiCardProps = {
  description: string;
  queryOptions: (
    range: Range,
  ) => ReturnType<
    | typeof totalRevenueKpiCardQueryOptions
    | typeof totalProfitKpiCardQueryOptions
    | typeof totalOrdersKpiCardQueryOptions
    | typeof newUsersCountKpiCardQueryOptions
  >;
  numberFormatter: (value: number) => string;
};

export function KpiCard({
  description,
  queryOptions,
  numberFormatter,
}: KpiCardProps) {
  const range = useRangeFromParams();
  const query = useQuery(queryOptions(range));

  const { status, data } = query;

  return (
    <Card className="@container/card flex flex-col justify-between">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {status === 'pending' ? (
            <Skeleton className="mt-1 h-8 w-[120px]" />
          ) : status === 'error' ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            numberFormatter(data.value)
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        {status === 'pending' ? (
          <Skeleton className="h-6 w-[80px]" />
        ) : status === 'error' ? null : (
          data.changePercentage !== 0 && (
            <Badge
              className={cn(
                'flex items-center gap-1 border-none',
                data.changePercentage > 0
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
              )}
            >
              {data.changePercentage > 0 && <IconTrendingUp size={16} />}
              {data.changePercentage < 0 && <IconTrendingDown size={16} />}
              {Intl.NumberFormat('en', {
                style: 'percent',
                maximumFractionDigits: 1,
              }).format(data.changePercentage / 100)}
            </Badge>
          )
        )}
      </CardFooter>
    </Card>
  );
}
