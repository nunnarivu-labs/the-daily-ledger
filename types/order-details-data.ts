import { OrderStatus } from '@/types/orders';

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
  createdAt: number;
  status: OrderStatus;
  totalAmount: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
};
