export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
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
