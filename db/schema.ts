import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  uuid,
  text,
  pgEnum,
  numeric,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', [
  'Coffee Beans',
  'Equipment',
  'Merchandise',
]);

export const orderStatusEnum = pgEnum('status', [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
]);

export const products = pgTable('products', {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
  category: categoryEnum().notNull(),
  price: numeric({ precision: 100, scale: 5 }).notNull(),
  cost: numeric({ precision: 100, scale: 5 }).notNull(),
  stock: integer().notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const users = pgTable(
  'users',
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex('email_idx').on(table.email),
    index('users_created_at_idx').on(table.createdAt),
  ],
);

export const orders = pgTable(
  'orders',
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    status: orderStatusEnum().notNull(),
    totalAmount: numeric('total_amount', {
      precision: 100,
      scale: 5,
    }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('orders_created_at_idx').on(table.createdAt),
    index('user_id_idx').on(table.userId),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    quantity: integer().notNull(),
    pricePerUnit: numeric('price_per_unit', {
      precision: 100,
      scale: 5,
    }).notNull(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
  },
  (table) => [
    index('order_id_idx').on(table.orderId),
    index('product_id_idx').on(table.productId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
