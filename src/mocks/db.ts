import type { Category, Order, Product, User, Variant } from '@/types'
import { deriveStockStatus } from '@/utils/stockStatus'

export interface MockUser extends User {
  password: string
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'T-Shirts' },
  { id: 'cat-2', name: 'Shirts' },
  { id: 'cat-3', name: 'Pants' },
  { id: 'cat-4', name: 'Caps' },
  { id: 'cat-5', name: 'Coats & Jackets' },
]

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Imigongo Pattern T-Shirt',
    description:
      'Cotton tee printed with a modern take on traditional Imigongo geometric art. Made in Kigali.',
    categoryId: 'cat-1',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1623487906320-9348195f97b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-2',
    name: 'Kigali Skyline Graphic Tee',
    description:
      'Soft ring-spun cotton t-shirt featuring a screen-printed Kigali skyline.',
    categoryId: 'cat-1',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-3',
    name: 'Inyambo Polo Shirt',
    description:
      'Breathable piqué polo shirt with an embroidered Inyambo horn emblem.',
    categoryId: 'cat-2',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1575267685970-7fbabf6ed7b0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-4',
    name: 'Kitenge Print Button-Up Shirt',
    description:
      'Tailored button-up shirt cut from vibrant, locally-sourced Kitenge fabric.',
    categoryId: 'cat-2',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1739758614124-b7ece08794f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-5',
    name: 'Kigali Classic Oxford Shirt',
    description:
      'Crisp Oxford-weave cotton shirt for everyday wear, tailored in Kigali.',
    categoryId: 'cat-2',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1624835567150-0c530a20d8cc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-6',
    name: 'Straight-Fit Chino Pants',
    description:
      'Durable cotton-twill chinos with a comfortable straight-leg fit.',
    categoryId: 'cat-3',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-7',
    name: 'Slim-Fit Denim Pants',
    description:
      'Stretch denim pants with a tapered, slim-fit cut and reinforced stitching.',
    categoryId: 'cat-3',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1584497691085-c3bb1e783373?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-8',
    name: 'Cargo Utility Pants',
    description:
      'Rugged cargo pants with multiple utility pockets, built for the field.',
    categoryId: 'cat-3',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1511794322962-129ddbd0af38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-9',
    name: 'Agaseke Weave Snapback Cap',
    description:
      'Structured snapback cap with a woven side panel inspired by the Agaseke basket.',
    categoryId: 'cat-4',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1458046143265-1824ba230418?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-10',
    name: 'Rwanda Crest Dad Cap',
    description:
      'Low-profile cotton dad cap with an embroidered Rwanda crest patch.',
    categoryId: 'cat-4',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-11',
    name: 'Volcanoes Fleece Coat',
    description:
      'Heavyweight fleece-lined coat designed for cool highland evenings.',
    categoryId: 'cat-5',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1616090517766-fa706e4bbd42?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-12',
    name: 'Nyungwe Rain Jacket',
    description:
      'Lightweight waterproof shell jacket, packable and built for the rain.',
    categoryId: 'cat-5',
    isActive: true,
    imageUrl:
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-13',
    name: 'Akagera Wool Peacoat',
    description:
      'Wool-blend peacoat with a tailored silhouette. Seasonal line, currently discontinued.',
    categoryId: 'cat-5',
    isActive: false,
    imageUrl:
      'https://images.unsplash.com/photo-1606146628666-2eb80a576bf0?auto=format&fit=crop&w=800&q=80',
  },
]

const COLORS = {
  white: { name: 'White', hex: '#FAFAF7' },
  black: { name: 'Black', hex: '#1A1A1A' },
  charcoal: { name: 'Charcoal', hex: '#55565A' },
  heatherGrey: { name: 'Heather Grey', hex: '#9C9C9C' },
  navy: { name: 'Navy', hex: '#1F2A44' },
  denim: { name: 'Denim Blue', hex: '#3B5D82' },
  khaki: { name: 'Khaki', hex: '#A79A78' },
  olive: { name: 'Olive', hex: '#6B7256' },
  beige: { name: 'Beige', hex: '#D8C8A8' },
  terracotta: { name: 'Terracotta', hex: '#C1633D' },
  indigo: { name: 'Indigo', hex: '#33415C' },
  lightBlue: { name: 'Light Blue', hex: '#AFC6D9' },
  forestGreen: { name: 'Forest Green', hex: '#3B5240' },
} as const

let variantSeq = 0
function variant(
  productId: string,
  color: keyof typeof COLORS,
  size: string,
  sku: string,
  price: number,
  stock: number,
  isActive = true,
): Variant {
  variantSeq += 1
  return {
    id: `var-${variantSeq}`,
    productId,
    sku,
    color: COLORS[color].name,
    colorHex: COLORS[color].hex,
    size,
    price,
    stock,
    status: deriveStockStatus(stock),
    isActive,
  }
}

export const variants: Variant[] = [
  // prod-1: Imigongo Pattern T-Shirt
  variant('prod-1', 'white', 'S', 'IMG-TEE-WHT-S', 12000, 18),
  variant('prod-1', 'white', 'M', 'IMG-TEE-WHT-M', 12000, 22),
  variant('prod-1', 'white', 'L', 'IMG-TEE-WHT-L', 12000, 0),
  variant('prod-1', 'black', 'S', 'IMG-TEE-BLK-S', 12000, 14),
  variant('prod-1', 'black', 'M', 'IMG-TEE-BLK-M', 12000, 3),
  variant('prod-1', 'black', 'L', 'IMG-TEE-BLK-L', 12000, 0, false),

  // prod-2: Kigali Skyline Graphic Tee
  variant('prod-2', 'black', 'S', 'KGL-TEE-BLK-S', 14000, 20),
  variant('prod-2', 'black', 'M', 'KGL-TEE-BLK-M', 14000, 4),
  variant('prod-2', 'black', 'L', 'KGL-TEE-BLK-L', 14000, 0),
  variant('prod-2', 'heatherGrey', 'S', 'KGL-TEE-GRY-S', 14000, 16),
  variant('prod-2', 'heatherGrey', 'M', 'KGL-TEE-GRY-M', 14000, 9),
  variant('prod-2', 'heatherGrey', 'L', 'KGL-TEE-GRY-L', 14000, 2),

  // prod-3: Inyambo Polo Shirt
  variant('prod-3', 'navy', 'S', 'INY-POLO-NVY-S', 22000, 16),
  variant('prod-3', 'navy', 'M', 'INY-POLO-NVY-M', 22000, 9),
  variant('prod-3', 'navy', 'L', 'INY-POLO-NVY-L', 22000, 2),
  variant('prod-3', 'navy', 'XL', 'INY-POLO-NVY-XL', 23000, 0),
  variant('prod-3', 'white', 'S', 'INY-POLO-WHT-S', 22000, 11),
  variant('prod-3', 'white', 'M', 'INY-POLO-WHT-M', 22000, 7),
  variant('prod-3', 'white', 'L', 'INY-POLO-WHT-L', 22000, 0),
  variant('prod-3', 'white', 'XL', 'INY-POLO-WHT-XL', 23000, 3),

  // prod-4: Kitenge Print Button-Up Shirt
  variant('prod-4', 'terracotta', 'M', 'KTG-SHIRT-TER-M', 28000, 12),
  variant('prod-4', 'terracotta', 'L', 'KTG-SHIRT-TER-L', 28000, 5),
  variant('prod-4', 'terracotta', 'XL', 'KTG-SHIRT-TER-XL', 29000, 1),
  variant('prod-4', 'indigo', 'M', 'KTG-SHIRT-IND-M', 28000, 8),
  variant('prod-4', 'indigo', 'L', 'KTG-SHIRT-IND-L', 28000, 0),
  variant('prod-4', 'indigo', 'XL', 'KTG-SHIRT-IND-XL', 29000, 4),

  // prod-5: Kigali Classic Oxford Shirt
  variant('prod-5', 'white', 'S', 'KCO-SHIRT-WHT-S', 25000, 14),
  variant('prod-5', 'white', 'M', 'KCO-SHIRT-WHT-M', 25000, 0),
  variant('prod-5', 'white', 'L', 'KCO-SHIRT-WHT-L', 25000, 7),
  variant('prod-5', 'lightBlue', 'S', 'KCO-SHIRT-LBL-S', 25000, 9),
  variant('prod-5', 'lightBlue', 'M', 'KCO-SHIRT-LBL-M', 25000, 4),
  variant('prod-5', 'lightBlue', 'L', 'KCO-SHIRT-LBL-L', 25000, 0),

  // prod-6: Straight-Fit Chino Pants
  variant('prod-6', 'khaki', '30', 'CHN-PANT-KHK-30', 26000, 11),
  variant('prod-6', 'khaki', '32', 'CHN-PANT-KHK-32', 26000, 8),
  variant('prod-6', 'khaki', '34', 'CHN-PANT-KHK-34', 26000, 3),
  variant('prod-6', 'navy', '30', 'CHN-PANT-NVY-30', 26000, 6),
  variant('prod-6', 'navy', '32', 'CHN-PANT-NVY-32', 26000, 0),
  variant('prod-6', 'navy', '34', 'CHN-PANT-NVY-34', 26000, 2),

  // prod-7: Slim-Fit Denim Pants
  variant('prod-7', 'denim', '30', 'DNM-PANT-DEN-30', 32000, 9),
  variant('prod-7', 'denim', '32', 'DNM-PANT-DEN-32', 32000, 2),
  variant('prod-7', 'denim', '34', 'DNM-PANT-DEN-34', 32000, 15),
  variant('prod-7', 'black', '30', 'DNM-PANT-BLK-30', 32000, 5),
  variant('prod-7', 'black', '32', 'DNM-PANT-BLK-32', 32000, 0),
  variant('prod-7', 'black', '34', 'DNM-PANT-BLK-34', 32000, 7),

  // prod-8: Cargo Utility Pants
  variant('prod-8', 'olive', '32', 'CGO-PANT-OLV-32', 30000, 6),
  variant('prod-8', 'olive', '34', 'CGO-PANT-OLV-34', 30000, 0),
  variant('prod-8', 'olive', '36', 'CGO-PANT-OLV-36', 30000, 4),
  variant('prod-8', 'khaki', '32', 'CGO-PANT-KHK-32', 30000, 10),
  variant('prod-8', 'khaki', '34', 'CGO-PANT-KHK-34', 30000, 3),
  variant('prod-8', 'khaki', '36', 'CGO-PANT-KHK-36', 30000, 0),

  // prod-9: Agaseke Weave Snapback Cap
  variant('prod-9', 'black', 'One Size', 'AGK-CAP-BLK', 9000, 25),
  variant('prod-9', 'beige', 'One Size', 'AGK-CAP-BEI', 9000, 3),
  variant('prod-9', 'forestGreen', 'One Size', 'AGK-CAP-GRN', 9500, 0),

  // prod-10: Rwanda Crest Dad Cap
  variant('prod-10', 'black', 'One Size', 'RWC-CAP-BLK', 8500, 40),
  variant('prod-10', 'khaki', 'One Size', 'RWC-CAP-KHK', 8500, 5),

  // prod-11: Volcanoes Fleece Coat
  variant('prod-11', 'charcoal', 'M', 'VLC-COAT-CHR-M', 58000, 7),
  variant('prod-11', 'charcoal', 'L', 'VLC-COAT-CHR-L', 58000, 1),
  variant('prod-11', 'charcoal', 'XL', 'VLC-COAT-CHR-XL', 60000, 0),
  variant('prod-11', 'olive', 'M', 'VLC-COAT-OLV-M', 58000, 5),
  variant('prod-11', 'olive', 'L', 'VLC-COAT-OLV-L', 58000, 0),
  variant('prod-11', 'olive', 'XL', 'VLC-COAT-OLV-XL', 60000, 2),

  // prod-12: Nyungwe Rain Jacket
  variant('prod-12', 'navy', 'S', 'NYG-JKT-NVY-S', 45000, 13),
  variant('prod-12', 'navy', 'M', 'NYG-JKT-NVY-M', 45000, 10),
  variant('prod-12', 'navy', 'L', 'NYG-JKT-NVY-L', 45000, 4),
  variant('prod-12', 'black', 'S', 'NYG-JKT-BLK-S', 45000, 8),
  variant('prod-12', 'black', 'M', 'NYG-JKT-BLK-M', 45000, 0),
  variant('prod-12', 'black', 'L', 'NYG-JKT-BLK-L', 47000, 0),

  // prod-13: Akagera Wool Peacoat (discontinued)
  variant('prod-13', 'navy', 'M', 'AKG-COAT-NVY-M', 89000, 2),
  variant('prod-13', 'navy', 'L', 'AKG-COAT-NVY-L', 89000, 0),
  variant('prod-13', 'charcoal', 'M', 'AKG-COAT-CHR-M', 89000, 0),
  variant('prod-13', 'charcoal', 'L', 'AKG-COAT-CHR-L', 89000, 0),
]

export const users: MockUser[] = [
  {
    id: 'user-2',
    email: 'user@katalog.rw',
    role: 'USER',
    password: 'user123',
  },
  {
    id: 'user-3',
    email: 'admin@katalog.rw',
    role: 'ADMIN',
    password: 'admin123',
  },
]

export const orders: Order[] = []
