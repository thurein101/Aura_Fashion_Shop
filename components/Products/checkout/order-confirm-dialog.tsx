
"use client";

import {
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type OrderConfirmDialogProps = {
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function OrderConfirmDialog({
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: OrderConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[420px] rounded-xl">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-orange-100 text-[#F66425]">
            <ShoppingBag className="size-5" />
          </div>

          <AlertDialogTitle className="text-lg">
            Confirm Your Order?
          </AlertDialogTitle>

          <AlertDialogDescription className="leading-relaxed">
            Are you sure you want to place this order?
            Please make sure your delivery address and
            contact number are correct before continuing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Once submitted, your order will be sent for confirmation.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            No, Go Back
          </AlertDialogCancel>

         <AlertDialogAction
  disabled={isPending}
  onClick={onConfirm}
  className="bg-slate-900 text-white hover:bg-slate-800"
>
  {isPending ? "Processing..." : "Yes, Place Order"}
</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
