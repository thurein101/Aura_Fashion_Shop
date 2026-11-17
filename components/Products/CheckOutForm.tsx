"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { createOrderAction } from "@/app/actions/checkout";
import { checkoutSchema } from "@/lib/validation/checkout";
import type { CheckoutInput } from "@/lib/validation/checkout";

import { Card } from "@/components/ui/card";

import { CheckoutFields } from "./checkout/checkout-fields";
import { OrderSummary } from "./checkout/order-summary";
import { ReceiptDialog } from "./checkout/recipt-dialog";
import { OrderConfirmDialog } from "./checkout/order-confirm-dialog";

import type {
  CheckoutErrors,
  CheckoutFormProps,
  ReceiptData,
} from "./checkout/checkout-types";

const initialValues: CheckoutInput = {
  address: "",
  contactNumber: "",
  paymentMethod: "CREDIT_CARD",
};

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState<CheckoutInput>(initialValues);

  const [errors, setErrors] = useState<CheckoutErrors>({});

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.variant.product.price * item.quantity,
        0,
      ),
    [cart],
  );

  // Validate individual field
  const validateField = (field: keyof CheckoutInput, value: string) => {
    const fieldSchema = checkoutSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  // Handle input changes
  const handleChange = (field: keyof CheckoutInput, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      validateField(field, value);
    }
  };

  // Handle blur
  const handleBlur = (field: keyof CheckoutInput) => {
    validateField(field, values[field]);
  };

  // Validate entire form
  const validateForm = () => {
    const result = checkoutSchema.safeParse(values);

    if (!result.success) {
      const newErrors: CheckoutErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && field in checkoutSchema.shape) {
          const key = field as keyof CheckoutInput;
          newErrors[key] ??= issue.message;
        }
      }

      setErrors(newErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  // Actual order submission
  const handleSubmit = () => {
    if (isPending) return;

    const validatedData = validateForm();

    if (!validatedData) {
      toast.error("Please check your information.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createOrderAction(validatedData);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        const now = new Date();

        const receiptItems = cart.map((item) => ({
          name: item.variant.product.name,
          variant: `${item.variant.size} / ${item.variant.color}`,
          quantity: item.quantity,
          price: item.variant.product.price,
          subtotal: item.variant.product.price * item.quantity,
        }));

        setReceipt({
          orderId: result.orderId,
          date: now.toISOString(),
          address: validatedData.address,
          contactNumber: validatedData.contactNumber,
          paymentMethod: validatedData.paymentMethod,
          items: receiptItems,
          total,
        });

        toast.success("Your order has been placed!");
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm ">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-7 shadow-xl">
            <div className="size-11 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

            <div className="text-center">
              <p className="font-semibold text-slate-900">
                Processing Your Order
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Please wait while we confirm your order.
              </p>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmOpen(true);
        }}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8"
      >
        {/* Checkout Fields */}
        <div className="space-y-5 lg:col-span-2 bg-[#F9F8F6]">
          <CheckoutFields
            values={values}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Security Note */}
          <Card className="rounded-xl border p-4 shadow-none">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                <span className="text-lg">✓</span>
              </div>

              <div>
                <p className="text-sm font-semibold">Safe & Secure Checkout</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your order information is handled securely.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <OrderSummary cart={cart} total={total} isPending={isPending} />
      </form>

      <OrderConfirmDialog
        open={confirmOpen}
        isPending={isPending}
        onOpenChange={setConfirmOpen}
        onConfirm={handleSubmit}
      />

      {/* Receipt */}
      <ReceiptDialog receipt={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}
