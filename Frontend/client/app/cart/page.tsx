"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import Link from "next/link";

export default function CartPage() {
    const cart = useCart();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // 👇 NUEVO CÁLCULO: Multiplicamos el precio por la cantidad de cada ítem
    const totalPrice = cart.items.reduce((total, item) => {
        return total + (Number(item.price) * item.quantity);
    }, 0);

    const onCheckout = async () => {
        if (!customerName || !customerEmail) {
            alert("Por favor, completa tu nombre y correo para realizar la compra.");
            return;
        }

        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch('http://localhost:4000/orders', {
                method: 'POST',
                headers: headers, 
                body: JSON.stringify({
                    customerName: customerName, 
                    customerEmail: customerEmail,
                    total: totalPrice,
                    items: cart.items,
                }),
            });

            if (response.ok) {
                alert("¡Compra realizada con éxito! 🎉");
                cart.removeAll();
                router.push("/");
            } else {
                alert("Hubo un error al procesar el pedido.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-black mb-10">Tu Carrito de Compras</h1>
        
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

                <div className="lg:col-span-7">
                    {cart.items.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-neutral-500 mb-4">No hay productos en el carrito.</p>
                            <Link href="/" className="text-black font-semibold hover:underline">
                                ← Volver a la tienda
                            </Link>
                        </div>
                    )}

                    <ul>
                        {cart.items.map((item) => (
                            <li key={item.id} className="flex py-6 border-b">
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover object-center" />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3><Link href={`/products/${item.id}`}>{item.name}</Link></h3>
                                            <p className="ml-4 font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.description.substring(0, 50)}...</p>
                                    </div>
                        
                                    {/* 👇 AQUÍ ESTÁN LOS NUEVOS BOTONES DE CANTIDAD */}
                                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            {/* 👇 Le agregamos 'disabled' y cambiamos su color si la cantidad es 1 */}
                                            <button 
                                                onClick={() => cart.decreaseQuantity(item.id)} 
                                                disabled={item.quantity <= 1}
                                                className={`px-3 py-1 font-bold transition-colors ${item.quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                                            >
                                                -
                                            </button>
                                            
                                            <span className="px-3 py-1 border-x border-gray-300 font-medium text-black">
                                                {item.quantity}
                                            </span>
                                            
                                            <button onClick={() => cart.increaseQuantity(item.id)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-bold">
                                                +
                                            </button>
                                        </div>
                                        
                                        <button onClick={() => cart.removeItem(item.id)} className="font-medium text-red-600 hover:text-red-500">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <h2 className="text-lg font-medium text-gray-900">Resumen del pedido</h2>
            
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <div className="text-base font-medium text-gray-900">Total</div>
                            <div className="text-xl font-bold text-gray-900">
                                ${totalPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {cart.items.length > 0 && (
                        <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-medium text-gray-900">Tus Datos</h3>
                            <div>
                                <input type="text" placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black" />
                            </div>
                            <div>
                                <input type="email" placeholder="Correo electrónico" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black" />
                            </div>
                        </div>
                    )}

                    <button disabled={cart.items.length === 0} onClick={onCheckout} className={`w-full mt-6 rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm ${cart.items.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}>
                        Pagar ahora
                    </button>
                </div>

            </div>
        </div>
    </div>
    );
}