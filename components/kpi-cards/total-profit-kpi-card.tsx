import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchTotalProfit } from '@/db/kpi';

export async function TotalProfitKpiCard() {
  const totalProfit = await fetchTotalProfit();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Profit</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(totalProfit)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
