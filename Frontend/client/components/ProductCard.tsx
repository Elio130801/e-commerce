"use client";

import Link from "next/link";
import { Product } from "@/types";
import WishlistIconButton from "@/components/ui/wishlist-icon-button";
// 👇 Importamos el hook de tu carrito
import useCart from "@/hooks/use-cart"; 

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const cart = useCart();

    // Función para manejar el clic y que no te redirija a otra página por accidente
    const onAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); 
        cart.addItem(product);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 flex flex-col relative group">
            
            <WishlistIconButton data={product} />

            {/* Imagen clickeable */}
            <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
                <Link href={`/products/${product.slug}`}>
                    <img 
                        src={product.images?.[0] || "https://via.placeholder.com/300"} 
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                </Link>
                {!product.isActive && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</span>
                )}
            </div>

            {/* Textos */}
            <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    {product.category?.name || "Sin categoría"}
                </span>
                <Link href={`/products/${product.slug}`}>
                    <h2 className="text-lg font-medium text-gray-900 line-clamp-1 hover:underline cursor-pointer">
                        {product.name}
                    </h2>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                </p>
            </div>
            
            {/* Precio y Botones */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-gray-900">
                    ${product.price}
                </span>
                
                {/* 👇 Rediseñamos esta parte para tener ambos botones */}
                <div className="flex gap-2">
                    <Link 
                        href={`/products/${product.slug}`}
                        className="border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:border-black hover:text-black transition-colors font-medium"
                    >
                        Detalles
                    </Link>
                    <button 
                        onClick={onAddToCart}
                        className="bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium flex items-center gap-1 shadow-sm"
                        title="Agregar al carrito"
                    >
                        + <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                    </button>
                </div>
            </div>

        </div>
    );
}