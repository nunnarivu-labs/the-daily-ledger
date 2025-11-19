import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export const useOrdersColumns = (): ColumnDef<Order>[] => {
  const router = useRouter();

  return useMemo(
    () => [
      { accessorKey: 'status', header: 'Status' },
      {
        accessorKey: 'totalAmount',
        header: 'Amount',
        cell: ({ row }) =>
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(row.getValue('totalAmount') as number),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) =>
          Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(row.getValue('createdAt') as Date),
      },
      {
        id: 'viewOrder',
        cell: ({ row }) => {
          return (
            <Button
              variant="outline"
              onClick={() => router.push(`/orders?orderId=${row.original.id}`)}
            >
              View Order
            </Button>
          );
        },
      },
    ],
    [router],
  );
};
