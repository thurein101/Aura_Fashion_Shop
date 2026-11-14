import 'dotenv/config';
import { PrismaClient, Category } from '../lib/generated/prisma';

import {prisma} from "../lib/prisma"

const COLORS = ["Black", "White", "Red", "Blue", "Navy", "Gray"];
const ADULT_SIZES = ["S", "M", "L", "XL", "XXL"];
const ACCESSORY_SIZES = ["One Size"];

// Helper to match the logic in your screenshot
function getSizesForCategory(category: Category): string[] {
  if (category === "KIDS") return ["2T", "3T", "4T", "5T", "6", "7", "8"];
  if (category === "ACCESSORIES") return ACCESSORY_SIZES;
  return ADULT_SIZES;
}

// Helper for dummy images
function productImage(slug: string) {
  return `https://picsum.photos/seed/${slug}/400/500`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data (optional but recommended to avoid duplicates)
  await prisma.productVariant.deleteMany();
  await prisma.productToUser.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productType.deleteMany();

  // 2. Create Product Types (ယာယီ - Temporary)
  console.log("Creating Product Types...");
  const typeTops = await prisma.productType.create({ data: { name: "Tops", slug: "tops" } });
  const typeBottoms = await prisma.productType.create({ data: { name: "Bottoms", slug: "bottoms" } });
  const typeOuterwear = await prisma.productType.create({ data: { name: "Outerwear", slug: "outerwear" } });
  const typeBags = await prisma.productType.create({ data: { name: "Bags", slug: "bags" } });

  // 3. Define a comprehensive list of products
  const productsData = [
    // MEN
    { name: "Classic Men's T-Shirt", slug: "classic-mens-tshirt", description: "Everyday cotton tee.", price: 19.99, category: Category.MEN, typeId: typeTops.id },
    { name: "Men's Denim Jeans", slug: "mens-denim-jeans", description: "Straight fit rugged denim.", price: 49.99, category: Category.MEN, typeId: typeBottoms.id },
    { name: "Men's Leather Jacket", slug: "mens-leather-jacket", description: "Premium faux leather.", price: 89.99, category: Category.MEN, typeId: typeOuterwear.id },
    
    // WOMEN
    { name: "Women's Silk Blouse", slug: "womens-silk-blouse", description: "Elegant evening wear.", price: 34.99, category: Category.WOMEN, typeId: typeTops.id },
    { name: "High-Waisted Leggings", slug: "high-waisted-leggings", description: "Perfect for yoga or running.", price: 29.99, category: Category.WOMEN, typeId: typeBottoms.id },
    { name: "Women's Winter Coat", slug: "womens-winter-coat", description: "Warm and stylish.", price: 119.99, category: Category.WOMEN, typeId: typeOuterwear.id },

    // KIDS
    { name: "Kids Graphic Tee", slug: "kids-graphic-tee", description: "Fun dinosaur print.", price: 14.99, category: Category.KIDS, typeId: typeTops.id },
    { name: "Kids Play Pants", slug: "kids-play-pants", description: "Durable cotton for playgrounds.", price: 18.99, category: Category.KIDS, typeId: typeBottoms.id },

    // ACCESSORIES
    { name: "Canvas Tote Bag", slug: "canvas-tote-bag", description: "Eco-friendly daily bag.", price: 24.99, category: Category.ACCESSORIES, typeId: typeBags.id },
    { name: "Classic Aviator Sunglasses", slug: "classic-aviator-sunglasses", description: "UV400 protection.", price: 15.99, category: Category.ACCESSORIES, typeId: null },
  ];

  console.log(`Seeding ${productsData.length} products with variants...`);

  // 4. Loop through products and create them alongside variants
  for (const productData of productsData) {
    const sizes = getSizesForCategory(productData.category);
    const colorSubset = COLORS.slice(0, 3); // Take first 3 colors like in your screenshot

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        imageUrl: productImage(productData.slug),
        isActive: true,
        typeId: productData.typeId,
      }
    });

    // Create Variants for this product
    for (const size of sizes) {
      for (const color of colorSubset) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: size,
            color: color,
            stock: Math.floor(Math.random() * 20) + 5, // Random stock between 5 and 24
            ImageUrl: productImage(`${product.slug}-${color.toLowerCase()}`),
          }
        });
      }
    }
  }

  console.log(`Successfully seeded ${productsData.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });