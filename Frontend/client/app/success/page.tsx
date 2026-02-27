"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { useSearchParams } from "next/navigation";

// 1. Separamos el contenido que lee la URL
function SuccessContent() {
    const cart = useCart();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);
    
    // Mercado Pago nos devuelve el ID de la operación en la URL
    const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

    useEffect(() => {
        setIsMounted(true);
        // 👇 MAGIA ARREGLADA: Vaciamos el carrito
        cart.removeAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 👈 CORRECCIÓN: Los corchetes vacíos evitan el bucle infinito

    if (!isMounted) return null;

    return (
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-600 mb-6">
                Tu compra se ha procesado correctamente. Muchas gracias por confiar en Lumière.
            </p>

            {paymentId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Número de operación</p>
                    <p className="text-lg font-mono text-black font-bold">#{paymentId}</p>
                </div>
            )}

            <Link 
                href="/" 
                className="inline-block w-full bg-black text-white font-medium px-6 py-3 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
            >
                Volver a la tienda
            </Link>
        </div>
    );
}

// 2. Exportamos la página envuelta en <Suspense> como exige Next.js
export default function SuccessPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <Suspense fallback={<div className="text-xl text-gray-500">Cargando detalles de tu pago...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}