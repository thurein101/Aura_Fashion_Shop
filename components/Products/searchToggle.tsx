"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react"; 
import { Input } from "@/components/ui/input";

export default function SearchToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition(); 
    const router = useRouter();
    const searchParams = useSearchParams();

    // ၁။ ရိုက်ထည့်နေတဲ့ စာသားကို ခဏသိမ်းထားဖို့ Local State တစ်ခု ဖန်တီးပါမယ်
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(); 

        if (term) {
            params.set("query", term);
            startTransition(() => {
                router.replace(`/?${params.toString()}`);
            });
        } else {
            startTransition(() => {
                router.replace(`/`);
            });
        }
    };

    // ၂။ Enter ခေါက်မှ handleSearch ကို အလုပ်လုပ်စေမယ့် Function
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(searchTerm);
        }
    };

    return (
        <div className="relative flex items-center">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-full hover:bg-muted/60 transition-colors text-foreground"
                    aria-label="Open Search"
                >
                    <Search className="w-5 h-5" />
                </button>
            ) : (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="relative w-64 sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        
                        <Input
                            autoFocus
                            placeholder="Search products..."
                            value={searchTerm} // ၃။ defaultValue အစား value ပြောင်းသုံးပါမယ်
                            onChange={(e) => setSearchTerm(e.target.value)} // ၄။ စာရိုက်တိုင်း State ထဲကိုပဲ အရင်ထည့်ထားပါမယ်
                            onKeyDown={handleKeyDown} // ၅။ Enter ခေါက်မှ တကယ့် Search ကို စလုပ်ပါမယ်
                            className="w-full pl-9 pr-9 rounded-xl bg-card/80 backdrop-blur-md border-border/60 text-xs"
                        />
                        
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                       
                                    }}
                                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Close Search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}