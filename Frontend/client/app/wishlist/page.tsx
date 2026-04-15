"use client";

import { useEffect, useState } from "react";
import useWishlist from "@/hooks/use-wishlist";
import ProductCard from "@/components/ProductCard"; 

export default function WishlistPage() {
    const wishlist = useWishlist();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Mi Lista de Deseos ❤️</h1>
                
                {wishlist.items.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center text-gray-500">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1} 
                            stroke="currentColor" 
                            className="w-16 h-16 mx-auto mb-4 text-gray-300"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <p className="text-lg">Aún no has guardado ningún producto como favorito.</p>
                        <p className="text-sm mt-2">¡Vuelve a la tienda y dale al corazón para guardarlos aquí!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.items.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}