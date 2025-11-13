import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { totalOrdersKpiCardQueryOptions } from '@/query/query-options';
import { Skeleton } from '@/components/ui/skeleton';
import { useRangeFromParams } from '@/hooks/use-range-from-params';

export function TotalOrdersKpiCard() {
  const range = useRangeFromParams();
  const query = useQuery(totalOrdersKpiCardQueryOptions(range));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Orders</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {query.isLoading ? (
            <Skeleton className="h-8 w-[100px] mt-1" />
          ) : query.isSuccess ? (
            Intl.NumberFormat('en', {
              style: 'decimal',
              notation: 'compact',
            }).format(query.data)
          ) : (
            <span></span>
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
