
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ReviewImage } from "@/lib/product-type";
import { cleanupUnusedReviewImagesAction } from "@/app/actions/review";
import { Input } from "@/components/ui/input";

type Props = {
  productId: string;
  value: ReviewImage[];
  onChange: (images: ReviewImage[]) => void;
  disabled?: boolean;
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ReviewImageUpload({
  productId,
  value,
  onChange,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<ReviewImage> => {
    const signatureResponse = await fetch(
      "/api/reviews/upload-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      }
    );

    const signatureData = await signatureResponse.json();

    if (!signatureResponse.ok) {
      throw new Error(signatureData.error || "Unable to prepare upload");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("public_id", signatureData.publicId);
    formData.append("overwrite", "false");
    formData.append("signature", signatureData.signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploaded = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploaded.error?.message || "Image upload failed");
    }

    return {
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
    };
  };

 const handleFiles = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(event.target.files ?? []);
  event.target.value = "";

  if (!files.length) return;

  if (value.length + files.length > MAX_IMAGES) {
    toast.error(`Maximum ${MAX_IMAGES} images allowed`);
    return;
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name}: JPG, PNG or WEBP only`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name}: Maximum file size is 5MB`);
      return;
    }
  }

  const uploadedImages: ReviewImage[] = [];

  setIsUploading(true);

  try {
    for (const file of files) {
      uploadedImages.push(await uploadFile(file));
    }

    onChange([...value, ...uploadedImages]);
    toast.success(`${uploadedImages.length} image(s) uploaded`);
  } catch (error) {
    if (uploadedImages.length) {
      await cleanupUnusedReviewImagesAction({
        publicIds: uploadedImages.map((image) => image.publicId),
      });
    }

    console.error("Review image upload:", error);

    toast.error(
      error instanceof Error ? error.message : "Upload failed"
    );
  } finally {
    setIsUploading(false);
  }
};

  const removeImage = async (publicId: string) => {
    const nextImages = value.filter(
      (image) => image.publicId !== publicId
    );

    onChange(nextImages);

    // Deletes only if this image is not attached to any saved review.
    await cleanupUnusedReviewImagesAction({
      publicIds: [publicId],
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Photos</p>
          <p className="text-xs text-muted-foreground">
            Optional · Up to 5 images · 5MB each
          </p>
        </div>

        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length}/{MAX_IMAGES}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {value.map((image) => (
          <div
            key={image.publicId}
            className="group relative size-[76px] overflow-hidden rounded-lg border bg-muted"
          >
            <Image
              src={image.url}
              alt="Review photo"
              fill
              sizes="76px"
              className="object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(image.publicId)}
              disabled={disabled || isUploading}
              aria-label="Remove image"
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className="grid size-[76px] place-items-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground transition hover:border-primary/50 hover:bg-muted disabled:opacity-50"
          >
            {isUploading ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
          </button>
        )}
      </div>

      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        disabled={disabled || isUploading}
        onChange={handleFiles}
      />

      {isUploading && (
        <p className="text-xs text-muted-foreground">
          Uploading images securely...
        </p>
      )}
    </div>
  );
}
