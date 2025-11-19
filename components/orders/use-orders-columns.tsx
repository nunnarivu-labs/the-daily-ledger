import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconTruckDelivery,
} from '@tabler/icons-react';

export const useOrdersColumns = (): ColumnDef<Order>[] => {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Status',
        enableHiding: false,
        cell: ({ row }) => {
          const { status } = row.original;

          return (
            <Badge variant="outline" className="gap-1">
              {status === 'Delivered' && (
                <IconCircleCheckFilled className="size-3.5 fill-green-500 text-white dark:fill-green-400" />
              )}
              {status === 'Shipped' && (
                <IconTruckDelivery className="size-3.5 text-blue-500 dark:text-blue-400" />
              )}
              {status === 'Pending' && (
                <IconLoader className="size-3.5 animate-spin text-muted-foreground" />
              )}
              {status === 'Cancelled' && (
                <IconCircleXFilled className="size-3.5 fill-red-500 text-white dark:fill-red-400" />
              )}
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'totalAmount',
        header: () => <div className="text-right">Amount</div>,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(parseFloat(row.getValue('totalAmount')))}
          </div>
        ),
      },
      {
        id: 'fullName',
        accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
        header: 'Name',
      },
      {
        id: 'email',
        accessorFn: (row) => row.user.email,
        header: 'Email',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableHiding: false,
        cell: ({ row }) =>
          Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(row.getValue('createdAt'))),
      },
      {
        id: 'viewOrder',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/orders?orderId=${row.original.id}`)
                }
              >
                View
              </Button>
            </div>
          );
        },
      },
    ],
    [router],
  );
};
