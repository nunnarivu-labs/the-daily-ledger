import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingDown } from '@tabler/icons-react';

export function KpiCardTemplate() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>New Customers</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          1,234
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingDown />
            -20%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Down 20% this period <IconTrendingDown className="size-4" />
        </div>
        <div className="text-muted-foreground">Acquisition needs attention</div>
      </CardFooter>
    </Card>
  );
}
