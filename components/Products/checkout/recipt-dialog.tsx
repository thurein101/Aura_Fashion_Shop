
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Download,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatPrice } from "@/lib/utils";
import type { ReceiptData } from "./checkout-types";

type Props = {
  receipt: ReceiptData | null;
  onClose: () => void;
};

export function ReceiptDialog({ receipt, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isDownloading, setIsDownloading] = useState(false);

  const date = receipt ? new Date(receipt.date) : null;

  const dateText = date?.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeText = date?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const handleDownload = async () => {
  const element = receiptRef.current;

  if (!element || !receipt) {
    toast.error("Receipt content is unavailable.");
    return;
  }

  try {
    setIsDownloading(true);

    await document.fonts.ready;

    const [{ default: html2canvas }, { jsPDF }] =
      await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const imageHeight =
      (canvas.height * contentWidth) / canvas.width;

    let renderedHeight = 0;

    while (renderedHeight < imageHeight) {
      if (renderedHeight > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        margin - renderedHeight,
        contentWidth,
        imageHeight
      );

      renderedHeight += contentHeight;
    }

    pdf.save(`receipt-${receipt.orderId}.pdf`);

    toast.success("Receipt downloaded successfully!");
  } catch (error) {
    console.error("PDF GENERATION ERROR:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to generate receipt PDF."
    );
  } finally {
    setIsDownloading(false);
  }
};

  return (
    <Dialog
      open={!!receipt}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-0 sm:max-w-[460px]">

        {/* Success Header */}
        <div className="px-6 pt-7 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>

          <DialogHeader className="items-center">
            <DialogTitle className="text-xl font-bold">
              Order Confirmed!
            </DialogTitle>

            <DialogDescription>
              Thank you! Your order has been placed successfully.
            </DialogDescription>
          </DialogHeader>
        </div>

        {receipt && (
          <>
            {/* Receipt Content */}
            <div
              ref={receiptRef}
              className="mx-5 space-y-5 bg-white p-5 text-gray-900"
            >
              {/* Brand */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#F66425]">
                    <ShoppingBag className="size-5 text-white" />
                  </div>

                  <span className="font-bold tracking-wide">
                    ORDER RECEIPT
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  #{receipt.orderId}
                </span>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <CalendarDays className="size-4" />
                    <span className="text-xs">Order Date</span>
                  </div>
                  <p className="text-sm font-semibold">{dateText}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Clock className="size-4" />
                    <span className="text-xs">Order Time</span>
                  </div>
                  <p className="text-sm font-semibold">{timeText}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">
                  {receipt.paymentMethod === "CASH_ON_DELIVERY"
                    ? "Cash on Delivery"
                    : "Credit / Debit Card"}
                </span>
              </div>

              <Separator className="bg-gray-200" />

              {/* Items */}
              <div>
                <h3 className="mb-4 text-sm font-bold">
                  ORDER ITEMS
                </h3>

                <div className="space-y-4">
                  {receipt.items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.variant} · Qty {item.quantity}
                        </p>
                      </div>

                      <span className="shrink-0 font-semibold">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="font-bold">Total Amount</span>
                <span className="text-xl font-bold text-[#F66425]">
                  {formatPrice(receipt.total)}
                </span>
              </div>

              {/* Delivery */}
              <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-bold">
                  DELIVERY INFORMATION
                </h3>

                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gray-500" />
                  <p className="break-words text-sm">
                    {receipt.address}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Phone className="size-4 shrink-0 text-gray-500" />
                  <p className="text-sm">{receipt.contactNumber}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 text-center">
                <p className="text-sm font-semibold">
                  Thank you for your purchase!
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Please keep this receipt for your records.
                </p>
              </div>
            </div>

            {/* Buttons - outside PDF */}
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-11 rounded-xl bg-[#F66425] hover:bg-[#e85a1f]"
              >
                <Download className="mr-2 size-4" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => router.push("/orders")}
              >
                View Orders
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
