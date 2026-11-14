import { NextRequest, NextResponse } from "next/server";
import { queryProductPage } from "@/lib/quiries/product-page";
import { productsPageQuerySchema } from "@/lib/validation/products";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

  
        const parsed = productsPageQuerySchema.safeParse({
            category: searchParams.get("category") ?? undefined,
            type: searchParams.get("type") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            cursor: searchParams.get("cursor") ?? undefined,
            limit: searchParams.get("limit") ?? undefined
        });

        if (!parsed.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    fieldError: parsed.error.flatten().fieldErrors 
                },
                { status: 400 }
            );
        }
        
       
        const { category, cursor, limit, type, search } = parsed.data; 

        const result = await queryProductPage(
            category as any,
            type,
            cursor,
            limit,
            search 
        );

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Product API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}