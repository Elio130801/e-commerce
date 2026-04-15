"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import useWishlist from "@/hooks/use-wishlist";

interface AddToWishlistButtonProps {
    data: Product;
}

export default function AddToWishlistButton({ data }: AddToWishlistButtonProps) {
    const wishlist = useWishlist();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const isSaved = wishlist.hasItem(data.id);

    const toggleWishlist = () => {
        if (isSaved) {
            wishlist.removeItem(data.id);
        } else {
            wishlist.addItem(data);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            title={isSaved ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={`p-3 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                isSaved 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'bg-white border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-500'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isSaved ? "0" : "1.5"} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </button>
    );
}