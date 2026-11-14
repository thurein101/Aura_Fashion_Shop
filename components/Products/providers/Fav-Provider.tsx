"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

// Context ထဲမှာ ပါမည့် Type များကို သတ်မှတ်ခြင်း
type FavouriteContextType = {
    isFavourite: (productId: string) => boolean;
    setFavourite: (productId: string, isFavourite: boolean) => void;
};

const FavouriteContext = createContext<FavouriteContextType | null>(null);

type FavouriteProviderProps = {
    initialFavouriteIds?: string[]; // Server ဘက်ကလာမည့် initial IDs များ (Array)
    children: React.ReactNode;
};

export function FavouriteProvider({ initialFavouriteIds = [], children }: FavouriteProviderProps) {
    //  Array ကို Set အဖြစ်ပြောင်းလဲပြီး state ထဲ ထည့်ခြင်း (Destructuring [] ကို မှန်ကန်စွာ သုံးပါ)
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(() => new Set(initialFavouriteIds));

    // Product တစ်ခု Favourite ဟုတ်/မဟုတ် စစ်ဆေးပေးသော Function
    const isFavourite = useCallback((productId: string) => {
        return favouriteIds.has(productId);
    }, [favouriteIds]);

    //  Favourite ထည့်ခြင်း (သို့) ဖျက်ခြင်း 
    const setFavourite = useCallback((productId: string, isFav: boolean) => {
        setFavouriteIds((prev) => {
            const newSet = new Set(prev);
            if (isFav) {
                newSet.add(productId);
            } else {
                newSet.delete(productId);
            }
            return newSet;
        });
    }, []);

    //  Performance အတွက် useMemo ဖြင့် value ကို Memoize လုပ်ခြင်း
    const value = useMemo(() => ({
        isFavourite,
        setFavourite
    }), [isFavourite, setFavourite]);

    return (
        <FavouriteContext.Provider value={value}>
            {children}
        </FavouriteContext.Provider>
    );
}

// Custom Hook for using Favourite Context safely
export function useFavourite() {
    const context = useContext(FavouriteContext);
    if (!context) {
        throw new Error("useFavourite must be used within a FavouriteProvider");
    }
    return context;
}