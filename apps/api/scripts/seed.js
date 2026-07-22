import { loadEnvFile } from "node:process";
loadEnvFile();

import mongoose from "mongoose";
import Category from "../src/models/category.js";
import Product from "../src/models/product.js";

// Example catalog: top-level categories with optional subcategories.
// Names are lowercased by the schema and must be unique (<= 32 chars).
const CATEGORIES = [
  {
    name: "electronics",
    description: "Devices, gadgets, and accessories.",
    children: [
      { name: "phones", description: "Smartphones and mobile accessories." },
      { name: "laptops", description: "Notebooks and portable computers." },
    ],
  },
  {
    name: "apparel",
    description: "Clothing and wearable items.",
    children: [
      { name: "mens-clothing", description: "Apparel for men." },
      { name: "womens-clothing", description: "Apparel for women." },
    ],
  },
  {
    name: "home",
    description: "Items for the home and kitchen.",
    children: [{ name: "kitchen", description: "Cookware, tools, and kitchen gadgets." }],
  },
];

// Example products. `category` references a category name above; the script
// resolves it to the matching `_id` before inserting.
const PRODUCTS = [
  {
    name: "Aurora X Pro Smartphone",
    description: "6.7-inch OLED display, 256GB storage, all-day battery.",
    price: 899.99,
    category: "phones",
    stock: 50,
    images: [{ url: "https://picsum.photos/seed/aurora-x/600/600", public_id: "seed/aurora-x" }],
  },
  {
    name: "Nimbus 14 Laptop",
    description: "14-inch IPS, 16GB RAM, 512GB SSD, lightweight chassis.",
    price: 1299.0,
    category: "laptops",
    stock: 25,
    images: [{ url: "https://picsum.photos/seed/nimbus-14/600/600", public_id: "seed/nimbus-14" }],
  },
  {
    name: "Classic Oxford Shirt",
    description: "Cotton button-down shirt with a relaxed fit.",
    price: 39.95,
    category: "mens-clothing",
    stock: 120,
  },
  {
    name: "Everyday Linen Dress",
    description: "Breathable linen dress for warm-weather wear.",
    price: 54.5,
    category: "womens-clothing",
    stock: 80,
  },
  {
    name: "Chef's Knife 8-inch",
    description: "High-carbon stainless steel blade with ergonomic handle.",
    price: 49.0,
    category: "kitchen",
    stock: 200,
  },
  {
    name: "Ceramic Pour-Over Set",
    description: "Minimalist pour-over brewer with matching carafe.",
    price: 28.0,
    category: "kitchen",
    stock: 150,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  const fresh = process.argv.includes("--fresh");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  if (fresh) {
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing categories and products");
  }

  // Two-pass insert so subcategories can reference their parent's _id.
  const categoryByName = new Map();

  for (const top of CATEGORIES) {
    const parent = await Category.findOneAndUpdate(
      { name: top.name },
      { name: top.name, description: top.description },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    categoryByName.set(top.name, parent._id);

    for (const child of top.children ?? []) {
      const created = await Category.findOneAndUpdate(
        { name: child.name },
        { name: child.name, description: child.description, parent: parent._id },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
      categoryByName.set(child.name, created._id);
    }
  }

  // Skip products that already exist (matched by name + category) so the
  // script is safe to run repeatedly; only create the missing ones.
  let created = 0;
  for (const product of PRODUCTS) {
    const categoryId = categoryByName.get(product.category);
    if (!categoryId) {
      console.warn(`Skipping "${product.name}": unknown category "${product.category}"`);
      continue;
    }

    const exists = await Product.findOne({ name: product.name, category: categoryId });
    if (exists) {
      continue;
    }

    await Product.create({ ...product, category: categoryId });
    created += 1;
  }

  const [catCount, prodCount] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
  ]);

  console.log(`Done. Categories: ${catCount}, Products: ${prodCount} (created ${created} new).`);
}

seed()
  .then(() => mongoose.disconnect())
  .catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });
