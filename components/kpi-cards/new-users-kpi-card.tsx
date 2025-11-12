import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchNewUsersCount } from '@/db/kpi';

export async function NewUsersKpiCard() {
  const newUsers = await fetchNewUsersCount();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>New Users</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en', {
            style: 'decimal',
            notation: 'compact',
          }).format(newUsers)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
