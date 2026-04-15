"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import useWishlist from "@/hooks/use-wishlist";

interface WishlistIconButtonProps {
    data: Product;
}

export default function WishlistIconButton({ data }: WishlistIconButtonProps) {
    const wishlist = useWishlist();
    const [isMounted, setIsMounted] = useState(false);

    // Evitamos problemas de hidratación en Next.js
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const isSaved = wishlist.hasItem(data.id);

    const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        // 👇 IMPORTANTE: Evitamos que al hacer clic en el corazón, 
        // el navegador entre a la página del producto (Link padre)
        e.preventDefault(); 
        e.stopPropagation();

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
            className="absolute top-3 right-3 p-2.5 bg-white border border-gray-100 rounded-full shadow-md transition-all z-10 hover:scale-105 active:scale-95 text-gray-400 hover:text-red-500 hover:border-red-500 group-hover:opacity-100"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isSaved ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth={isSaved ? "0" : "1.5"} 
                className={`w-5 h-5 transition-colors ${isSaved ? 'text-red-500' : ''}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </button>
    );
}