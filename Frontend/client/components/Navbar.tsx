"use client";

import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { useState, useEffect } from "react";

export default function Navbar() {
    const cart = useCart();
    const [isMounted, setIsMounted] = useState(false);

    // Evitamos errores de hidratación esperando a que cargue el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="border-b border-gray-200 sticky top-0 z-50 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* 1. LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                        <p className="font-bold text-xl tracking-tight uppercase">Lumière</p>
                    </Link>

                    {/* 2. BARRA DE BÚSQUEDA (Solo visual por ahora) */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
                        <input 
                            type="text"
                            placeholder="Buscar productos..."
                            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
                        />
                        <button>
                        🔍 {/* Puedes cambiar esto por un icono SVG más tarde */}
                        </button>
                    </div>

                    {/* 3. ACCIONES (Carrito y Admin) */}
                    <div className="flex items-center gap-6">
            
                        {/* Botón Carrito */}
                        <Link href="/cart" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                            <span>🛒</span>
                            <span className="font-bold text-sm">
                                {/* Truco: Si no está montado mostramos 0 para evitar saltos */}
                                {isMounted ? cart.items.length : 0}
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}