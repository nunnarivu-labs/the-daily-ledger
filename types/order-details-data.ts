import { OrderStatus } from '@/types/orders';
import { User } from '@/types/user';

type OrderItem = {
  quantity: number;
  pricePerUnit: number;
  product: {
    name: string;
    imageUrl: string;
  };
};

export type OrderDetailsData = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  user: User;
  items: OrderItem[];
};
