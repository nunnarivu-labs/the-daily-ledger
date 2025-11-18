import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderDetailsData } from '@/types/order-details-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@radix-ui/react-menu';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';

const fetchOrderDetails = async (orderId: string): Promise<OrderDetailsData> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: orderId,
          createdAt: Date.now(),
          status: 'Shipped',
          totalAmount: 125.5,
          user: {
            firstName: 'Johnson',
            lastName: 'Abraham',
            email: 'johnson@example.com',
          },
          items: [
            {
              quantity: 2,
              pricePerUnit: 25.0,
              product: {
                name: 'Artisan Roast Espresso Beans',
                imageUrl: 'https://picsum.photos/seed/laS6tbl/374/3631',
              },
            },
            {
              quantity: 1,
              pricePerUnit: 75.5,
              product: {
                name: 'Premium Coffee Grinder',
                imageUrl: 'https://picsum.photos/seed/5bsZA/3216/3768',
              },
            },
          ],
        }),
      1000,
    ),
  );

export function OrderModal({ orderId }: { orderId: string }) {
  const router = useRouter();

  const { data, status } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetails(orderId),
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      router.push('/orders');
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOnOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {status === 'pending' ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-24" />{' '}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-24" />{' '}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-24" />{' '}
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="py-8 text-center text-destructive">
            <p>Could not load order details. Please try again.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-2 py-4 text-sm">
              <span className="font-medium text-muted-foreground">
                Order ID
              </span>
              <span>{data.id}</span>

              <span className="font-medium text-muted-foreground">
                Customer
              </span>
              <span>{`${data.user.firstName} ${data.user.lastName}`}</span>

              <span className="font-medium text-muted-foreground">
                Order Date
              </span>
              <span>{new Date(data.createdAt).toLocaleDateString()}</span>

              <span className="font-medium text-muted-foreground">Status</span>
              <Badge variant="outline">{data.status}</Badge>
            </div>

            <Separator />

            <div className="py-4">
              <h3 className="mb-2 font-medium">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Item</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Avatar className="rounded-md">
                          <AvatarImage
                            src={item.product.imageUrl}
                            alt={item.product.name}
                          />
                          <AvatarFallback>
                            {item.product.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.pricePerUnit * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t px-4 py-2 font-bold">
                <span>Grand Total</span>
                <span>
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(data.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
