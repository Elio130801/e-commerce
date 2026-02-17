"use client"; // 👈 Esto marca que este trozo es interactivo

import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface AddToCartButtonProps {
    data: Product;
}

export default function AddToCartButton({ data }: AddToCartButtonProps) {
    const cart = useCart();

    const onAddToCart = () => {
        cart.addItem(data);
    };

    return (
        <button
            onClick={onAddToCart}
            disabled={!data.isActive}
            className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                data.isActive 
                    ? "bg-black hover:bg-gray-800" 
                    : "bg-gray-300 cursor-not-allowed"
            } transition-colors`}
        >
            {data.isActive ? "Añadir al Carrito" : "Sin Stock"}
        </button>
    );
}