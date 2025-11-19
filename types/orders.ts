import { User } from '@/types/user';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  user: User;
};

export type OrderPaging = {
  count: number;
  offset: number;
  limit: number;
};

export type OrderResult = {
  paging: OrderPaging;
  orders: Order[];
};
