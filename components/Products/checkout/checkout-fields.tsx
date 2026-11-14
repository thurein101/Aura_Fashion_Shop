
"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { CheckoutFieldsProps } from "./checkout-types";

export function CheckoutFields({
  values,
  errors,
  onChange,
  onBlur,
}: CheckoutFieldsProps) {
  // Demo-only card inputs. These values are not sent to the server.
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(" ") ?? "";
    setCardNumber(formatted);
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      setExpiry(digits);
      return;
    }

    setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
  };

  const handleCvvChange = (value: string) => {
    setCvv(value.replace(/\D/g, "").slice(0, 4));
  };

  return (
    <div className="space-y-6">
      {/* Shipping Information */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <MapPin className="size-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Shipping Information
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Where should we deliver your order?
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">
              Delivery Address <span className="text-red-500">*</span>
            </Label>

            <textarea
              id="address"
              required
              minLength={10}
              maxLength={500}
              value={values.address}
              onChange={(e) => onChange("address", e.target.value)}
              onBlur={() => onBlur("address")}
              placeholder="Enter your full delivery address"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
              className={`min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 ${
                errors.address ? "border-red-500" : "border-slate-200"
              }`}
            />

            {errors.address && (
              <p
                id="address-error"
                className="flex items-center gap-1.5 text-xs text-red-500"
              >
                <AlertCircle className="size-3.5" />
                {errors.address}
              </p>
            )}

            <p className="text-xs text-slate-500">
              Include your township, city and nearby landmarks.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="contactNumber"
              className="text-sm font-medium text-slate-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="contactNumber"
                type="tel"
                required
                maxLength={20}
                value={values.contactNumber}
                onChange={(e) =>
                  onChange("contactNumber", e.target.value)
                }
                onBlur={() => onBlur("contactNumber")}
                placeholder="+95 9xxxxxxxxx"
                aria-invalid={!!errors.contactNumber}
                aria-describedby={
                  errors.contactNumber ? "phone-error" : undefined
                }
                className={`h-11 rounded-xl border-slate-200 pl-10 text-sm focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-100 ${
                  errors.contactNumber ? "border-red-500" : ""
                }`}
              />
            </div>

            {errors.contactNumber && (
              <p
                id="phone-error"
                className="flex items-center gap-1.5 text-xs text-red-500"
              >
                <AlertCircle className="size-3.5" />
                {errors.contactNumber}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <CreditCard className="size-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Payment Details
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Enter your card information.
              </p>
            </div>

            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Selected
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {/* Selected payment method */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
              <CreditCard className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                Credit / Debit Card
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Card payment
              </p>
            </div>

            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>

          {/* Cardholder */}
          <div className="space-y-2">
            <Label htmlFor="cardholder" className="text-sm font-medium text-slate-700">
              Cardholder Name
            </Label>

            <Input
              id="cardholder"
              value={cardholder}
              onChange={(e) => setCardholder(e.target.value)}
              placeholder="Name on card"
              autoComplete="off"
              maxLength={60}
              className="h-11 rounded-xl border-slate-200 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-100"
            />
          </div>

          {/* Card number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium text-slate-700">
              Card Number
            </Label>

            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="0000 0000 0000 0000"
                autoComplete="off"
                maxLength={19}
                className="h-11 rounded-xl border-slate-200 pr-12 tracking-wider focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-100"
              />

              <CreditCard className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-medium text-slate-700">
                Expiry Date
              </Label>

              <Input
                id="expiry"
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                autoComplete="off"
                maxLength={5}
                className="h-11 rounded-xl border-slate-200 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-medium text-slate-700">
                CVV
              </Label>

              <Input
                id="cvv"
                type="password"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                placeholder="123"
                autoComplete="off"
                maxLength={4}
                className="h-11 rounded-xl border-slate-200 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-100"
              />
            </div>
          </div>

          {/* Demo notice */}
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-500" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                Demo card form
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                This is a demo-only interface. Card details are kept in
                component state and are not processed or saved. Real card
                payments require a payment gateway.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="size-4" />
            Secure payment experience
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
