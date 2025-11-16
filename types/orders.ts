export type Order = {
  id: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: Date;
};

export type OrderResult = {
  count: number;
  orders: Order[];
};
