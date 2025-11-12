import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchTotalRevenue } from '@/db/kpi';

export async function TotalRevenueKpiCard() {
  const totalRevenue = await fetchTotalRevenue();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(totalRevenue)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
