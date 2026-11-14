
import type { CheckoutInput } from "@/lib/validation/checkout";
import type { CartItem } from "@/lib/product-type";

export type CheckoutErrors = Partial<
  Record<keyof CheckoutInput, string>
>;

export type CheckoutFieldsProps = {
  values: CheckoutInput;
  errors: CheckoutErrors;
  onChange: (field: keyof CheckoutInput, value: string) => void;
  onBlur: (field: keyof CheckoutInput) => void;
};

export type ReceiptItem = {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type ReceiptData = {
  orderId: string;
  date: string;
  address: string;
  contactNumber: string;
  paymentMethod: CheckoutInput["paymentMethod"];
  items: ReceiptItem[];
  total: number;
};

export type CheckoutFormProps = {
  cart: CartItem[];
};
