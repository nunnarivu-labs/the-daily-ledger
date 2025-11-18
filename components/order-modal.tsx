import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function OrderModal({ orderId }: { orderId: string }) {
  const router = useRouter();

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      router.push(`/orders`);
    }
  };

  // ... your useQuery logic for fetching order details ...

  return (
    <Dialog open={true} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Order Details ${orderId}`}</DialogTitle>
        </DialogHeader>
        {/* ... render order details, skeleton, or error ... */}
      </DialogContent>
    </Dialog>
  );
}
