export { cn } from "cn"

export const VALID_CATEGORIES = [
    { value: "MEN", label: "Men" },
    { value: "WOMEN", label: "Women" },
    { value: "KIDS", label: "Kids" },
    {value:"ACCESSORIES",label:"Accessories"}

] as const;

export type CategoryValue = (typeof VALID_CATEGORIES)[number]["value"];

export function getCategoryLabel(category: CategoryValue | string) {
    return VALID_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function formatPrice(price: number | string): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : Number(price);

    if (isNaN(numericPrice)) {
        return "$0.00";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", 
        minimumFractionDigits: 2,
    }).format(numericPrice);
}