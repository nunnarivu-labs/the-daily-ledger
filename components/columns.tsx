import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/orders';

export const columns: ColumnDef<Order>[] = [
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  { accessorKey: 'createdAt', header: 'Created At' },
];
