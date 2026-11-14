import { CategoryValue } from "@/lib/utils"; 

export type ProductVariantListItem = {
    id: string;
    size: string;
    color: string;
    stock: number;
    ImageUrl: string;
};


export type ProductTypeItem = {
    id: string;
    name: string;
    slug: string;
};
//we also do it for product card and then product detail don't forget about productVariant 
export type ProductListItem = {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: CategoryValue;
    imageUrl: string;
    typeId: string | null;
    type: ProductTypeItem | null; 
    productVariants: ProductVariantListItem[];
};

export type ProductsPageResult = {
    items: ProductListItem[];
    nextCursor: string | null;
    hasMore: boolean;
};

export type ProductDetail = Omit<ProductListItem, "productVariants"> & {
    description: string | null; 
    imageUrl: string;
    category: string;
    type?: { name: string; slug: string } | null;
    
   
    productVariants?: Array<ProductVariantListItem & { imageUrl: string | null }>;
    
    reviews?: Array<{
        id: string;
        rating: number;
        comment: string | null;
        user: { 
            name: string; 
            image: string | null; 
        };
    }>;
};



//cart
export type CartProductItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
};

export type CartItem = {
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    color: string;
    stock: number;
    ImageUrl: string;
    product: CartProductItem;
  };
};

export type CartResult =
  | {
      success: true;
      data: CartItem[];
    }
  | {
      success: false;
      error: string;
    };