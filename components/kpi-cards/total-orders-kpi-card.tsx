import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchTotalOrdersCount } from '@/db/kpi';

export async function TotalOrdersKpiCard() {
  const totalOrders = await fetchTotalOrdersCount();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Orders</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en', {
            style: 'decimal',
            notation: 'compact',
          }).format(totalOrders)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
