
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { uploadSignatureSchema } from "@/lib/validation/review";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();
    const parsed = uploadSignatureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const publicId =
      `reviews/${session.user.id}/${productId}/${randomUUID()}`;

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      overwrite: false,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      publicId,
      overwrite: false,
      signature,
    });
  } catch (error) {
    console.error("Review upload signature error:", error);

    return NextResponse.json(
      { error: "Unable to prepare image upload" },
      { status: 500 }
    );
  }
}
