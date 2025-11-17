export type Order = {
  id: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
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
