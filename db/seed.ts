import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index";
import * as schema from "./schema";
import { v4 as uuid } from "uuid";

// --- Configuration ---
const USERS_TO_CREATE = 5000;
const PRODUCTS_TO_CREATE = 100;
const ORDERS_TO_CREATE = 1_000_000;
const BATCH_SIZE = 1000;

async function main() {
  console.log("Seeding database with Drizzle...");

  // --- 1. Clear Existing Data ---
  console.log("Clearing existing data...");
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.products);
  await db.delete(schema.users);

  // --- 2. Seed Products ---
  console.log(`Creating ${PRODUCTS_TO_CREATE} products...`);
  const productsData: (typeof schema.products.$inferInsert)[] = [];
  for (let i = 0; i < PRODUCTS_TO_CREATE; i++) {
    productsData.push({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement([
        "Coffee Beans",
        "Equipment",
        "Merchandise",
      ]),
      price: faker.commerce.price({ min: 15, max: 200, dec: 5 }),
      cost: faker.commerce.price({ min: 5, max: 100, dec: 5 }),
      stock: faker.number.int({ min: 0, max: 200 }),
      imageUrl: faker.image.url(),
    });
  }
  const createdProducts = await db
    .insert(schema.products)
    .values(productsData)
    .returning();

  // --- 3. Seed Users ---
  console.log(`Creating ${USERS_TO_CREATE} users...`);
  const usersData: (typeof schema.users.$inferInsert)[] = [];
  for (let i = 0; i < USERS_TO_CREATE; i++) {
    usersData.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    });
  }
  const createdUsers = await db
    .insert(schema.users)
    .values(usersData)
    .returning();

  // --- 4. Seed Orders and Order Items in Batches ---
  console.log(
    `Creating ${ORDERS_TO_CREATE} orders in batches of ${BATCH_SIZE}...`,
  );
  for (let i = 0; i < ORDERS_TO_CREATE / BATCH_SIZE; i++) {
    const ordersBatch: (typeof schema.orders.$inferInsert)[] = [];
    const orderItemsBatch: (typeof schema.orderItems.$inferInsert)[] = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
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
          "Pending",
          "Shipped",
          "Delivered",
          "Cancelled",
        ]),
        totalAmount: totalAmount.toString(),
        createdAt: faker.date.past({ years: 2 }),
      });
    }

    await db.insert(schema.orders).values(ordersBatch);
    await db.insert(schema.orderItems).values(orderItemsBatch);

    console.log(`Batch ${i + 1} of ${ORDERS_TO_CREATE / BATCH_SIZE} complete.`);
  }

  console.log("Seeding complete!");
  // Drizzle doesn't require an explicit disconnect, so we can exit.
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
