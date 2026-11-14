"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavourite } from "./providers/Fav-Provider";
import { toggleFavouriteAction } from "@/app/actions/favourite";
import { toast } from "sonner";

type FavBtnProps = {
  productId: string;
  className?: string;
  initialIsFavorited?: boolean;
};

export default function FavouriteBtn({ 
  productId, 
  className, 
  initialIsFavorited = false 
}: FavBtnProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Context မှ isFavourite နှင့် setFavourite ကို ရယူပါ
  const { isFavourite, setFavourite } = useFavourite();

  // လက်ရှိ product သည် favourite ဖြစ်/မဖြစ် စစ်ဆေးခြင်း
  const favorited = isFavourite(productId);

  const handleToggleFavorite = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const previousFavourite = favorited;
    const newFavState = !previousFavourite;

    // ၁။ UI ကို ချက်ချင်း အပြောင်းအလဲလုပ်မည် (Optimistic Update)
    setFavourite(productId, newFavState);

    startTransition(async () => {
      try {
        const res = await toggleFavouriteAction({ productId });

        if (!res.success) {
          // Error ဖြစ်သွားပါက မူလအခြေအနေသို့ ပြန်ပြောင်းမည် (Rollback)
          setFavourite(productId, previousFavourite);
          
          // Server က "Unauthenticated" လို့ ပို့တာနဲ့ တိုက်စစ်ပါ
          if (res.error === "Unauthenticated") {
            router.push("/sign-in");
          }
          toast.error("Failed to update favourite");
          return;
        }

        // Server က တကယ် Confirm ဖြစ်သွားတဲ့ အခြေအနေကို စစ်ဆေးခြင်း
        const confirmed = res.data?.isFavorited ?? newFavState;

        if (confirmed !== newFavState) {
          setFavourite(productId, confirmed);
        }

        if (confirmed) {
          toast.success("Added to favourites");
        } else {
          toast.info("Removed from favourites");
        }

        router.refresh();

      } catch (error) {
        // Network Error သို့မဟုတ် အခြားချွတ်ယွင်းချက်များအတွက် Rollback လုပ်ရန်
        setFavourite(productId, previousFavourite);
        console.error("Failed to toggle favourite", error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon" 
      className={cn(className)}
      onClick={handleToggleFavorite}
      aria-pressed={favorited}
      aria-busy={isPending}
      disabled={isPending} //  Request တင်နေစဉ် ထပ်မနှိပ်နိုင်ရန် ပိတ်ထားခြင်း
    > 
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}