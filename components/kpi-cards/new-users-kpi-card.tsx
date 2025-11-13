import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { newUsersCountKpiCardQueryOptions } from '@/query/query-options';
import { useRangeFromParams } from '@/hooks/use-range-from-params';

export function NewUsersKpiCard() {
  const range = useRangeFromParams();
  console.log(`range: ${JSON.stringify(range)}`);
  const query = useQuery(newUsersCountKpiCardQueryOptions(range));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>New Users</CardDescription>
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
