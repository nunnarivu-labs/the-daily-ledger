import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { db } from './index';
import * as schema from './schema';
import { v4 as uuid } from 'uuid';

// --- Configuration ---
const USERS_TO_CREATE = 50_000;
const PRODUCTS_TO_CREATE = 500;
const ORDERS_TO_CREATE = 10_000_000;
const MEMORY_BATCH_SIZE = 10000;
const DB_CHUNK_SIZE = 500; // A safe chunk size for all large inserts

async function main() {
  console.log('Seeding database with Drizzle...');

  // --- 1. Clear Existing Data ---
  console.log('Clearing existing data...');
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.products);
  await db.delete(schema.users);

  // --- 2. Seed Products ---
  // This is a small enough number that it doesn't need chunking.
  console.log(`Creating ${PRODUCTS_TO_CREATE} products...`);
  const productsData: (typeof schema.products.$inferInsert)[] = [];
  for (let i = 0; i < PRODUCTS_TO_CREATE; i++) {
    productsData.push({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement([
        'Coffee Beans',
        'Equipment',
        'Merchandise',
      ]),
      price: faker.commerce.price({ min: 15, max: 200 }),
      cost: faker.commerce.price({ min: 5, max: 100 }),
      stock: faker.number.int({ min: 0, max: 200 }),
      imageUrl: faker.image.url(),
    });
  }
  const createdProducts = await db
    .insert(schema.products)
    .values(productsData)
    .returning();

  // --- 3. Seed Users with Chunking ---
  console.log(`Creating ${USERS_TO_CREATE} users in memory...`);
  const usersData: (typeof schema.users.$inferInsert)[] = [];
  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    usersData.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName: `${lastName}${i}` }),
      createdAt: faker.date.past({ years: 3 }),
    });
  }

  console.log(
    `  Inserting ${USERS_TO_CREATE} users into DB in chunks of ${DB_CHUNK_SIZE}...`,
  );
  for (let i = 0; i < usersData.length; i += DB_CHUNK_SIZE) {
    const chunk = usersData.slice(i, i + DB_CHUNK_SIZE);
    await db.insert(schema.users).values(chunk);
  }

  // After all users are inserted, fetch them back to get their generated IDs
  console.log('Fetching all created users...');
  const createdUsers = await db.select().from(schema.users);

  // --- 4. Seed Orders and Order Items with Chunking ---
  console.log(
    `Creating ${ORDERS_TO_CREATE} orders in memory batches of ${MEMORY_BATCH_SIZE}...`,
  );
  const totalBatches = ORDERS_TO_CREATE / MEMORY_BATCH_SIZE;

  for (let i = 0; i < totalBatches; i++) {
    const ordersBatch: (typeof schema.orders.$inferInsert)[] = [];
    const orderItemsBatch: (typeof schema.orderItems.$inferInsert)[] = [];

    for (let j = 0; j < MEMORY_BATCH_SIZE; j++) {
      const randomUser = faker.helpers.arrayElement(createdUsers);
      const orderId = uuid();
      let totalAmount = 0;

      const itemsCount = faker.number.int({ min: 1, max: 5 });
      for (let k = 0; k < itemsCount; k++) {
        const randomProduct = faker.helpers.arrayElement(createdProducts);
        const quantity = faker.number.int({ min: 1, max: 5 });
        const pricePerUnit = randomProduct.price;

        orderItemsBatch.push({
          orderId: orderId,
          productId: randomProduct.id,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
        });
        totalAmount += parseFloat(pricePerUnit) * quantity;
      }

      ordersBatch.push({
        id: orderId,
        userId: randomUser.id,
        status: faker.helpers.arrayElement([
          'Pending',
          'Shipped',
          'Delivered',
          'Cancelled',
        ]),
        totalAmount: totalAmount.toString(),
        createdAt: faker.date.past({ years: 3 }),
      });
    }

    console.log(
      `  Inserting memory batch ${i + 1}/${totalBatches} into DB in chunks of ${DB_CHUNK_SIZE}...`,
    );
    for (let k = 0; k < ordersBatch.length; k += DB_CHUNK_SIZE) {
      const chunk = ordersBatch.slice(k, k + DB_CHUNK_SIZE);
      await db.insert(schema.orders).values(chunk);
    }

    for (let k = 0; k < orderItemsBatch.length; k += DB_CHUNK_SIZE) {
      const chunk = orderItemsBatch.slice(k, k + DB_CHUNK_SIZE);
      await db.insert(schema.orderItems).values(chunk);
    }

    console.log(`Memory batch ${i + 1} of ${totalBatches} complete.`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
