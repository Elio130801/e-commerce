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
    
    // 👇 Estados locales para el input del cupón
    const [couponCode, setCouponCode] = useState("");
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // 🧮 CÁLCULOS MATEMÁTICOS DEL CARRITO
    const subtotal = cart.items.reduce((total, item) => {
        return total + (Number(item.price) * item.quantity);
    }, 0);

    // Calculamos cuánto dinero se le va a descontar
    const discountAmount = cart.coupon ? (subtotal * cart.coupon.discountPercentage) / 100 : 0;
    // Total final real que va a pagar
    const finalPrice = subtotal - discountAmount;

    // 🎟️ FUNCIÓN PARA VALIDAR EL CUPÓN CONTRA NESTJS
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        
        setIsApplying(true);
        try {
            const res = await fetch(`http://localhost:4000/coupons/validate/${couponCode.trim()}`);
            if (res.ok) {
                const data = await res.json();
                cart.applyCoupon({ code: data.code, discountPercentage: data.discountPercentage });
                setCouponCode(""); 
            } else {
                alert("El cupón es inválido o ha expirado ❌");
            }
        } catch (error) {
            console.error("Error validando cupón:", error);
            alert("Error de conexión al validar el cupón.");
        } finally {
            setIsApplying(false);
        }
    };

    const onCheckout = async () => {
        if (!customerName || !customerEmail) {
            alert("Por favor, completa tu nombre y correo para realizar la compra.");
            return;
        }

        const token = localStorage.getItem("token");
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch('http://localhost:4000/payments/create', {
                method: 'POST',
                headers: headers, 
                body: JSON.stringify({
                    customerName: customerName, 
                    customerEmail: customerEmail,
                    total: finalPrice, // 👈 ENVIAMOS EL TOTAL YA CON DESCUENTO A MERCADO PAGO
                    items: cart.items, 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url; 
                } else {
                    alert("No se pudo obtener el link de pago.");
                }
            } else {
                alert("Hubo un error al conectar con la pasarela de pago.");
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
                        
                                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                        <div className="flex items-center border border-gray-300 rounded-md">
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

                <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Resumen del pedido</h2>
            
                    <div className="space-y-4">
                        
                        {/* 🎟️ INTERFAZ DEL CUPÓN DE DESCUENTO */}
                        {cart.items.length > 0 && (
                            <div className="border-b border-gray-200 pb-6 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">¿Tienes un código de descuento?</label>
                                {!cart.coupon ? (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Ej: BIENVENIDA10" 
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black uppercase"
                                        />
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={isApplying || !couponCode}
                                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                                        >
                                            {isApplying ? "..." : "Aplicar"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 font-bold">✓ {cart.coupon.code}</span>
                                            <span className="text-sm font-medium text-green-700">(-{cart.coupon.discountPercentage}%)</span>
                                        </div>
                                        <button 
                                            onClick={() => cart.removeCoupon()}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 🧮 TABLA DE CÁLCULOS */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-500">Subtotal</div>
                                <div className="font-medium text-gray-900">${subtotal.toFixed(2)}</div>
                            </div>
                            
                            {cart.coupon && (
                                <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                                    <div>Descuento ({cart.coupon.code})</div>
                                    <div>-${discountAmount.toFixed(2)}</div>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                                <div className="text-base font-bold text-gray-900">Total</div>
                                <div className="text-2xl font-bold text-black">
                                    ${finalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {cart.items.length > 0 && (
                        <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-medium text-gray-900">Tus Datos</h3>
                            <div>
                                <input type="text" placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black" />
                            </div>
                            <div>
                                <input type="email" placeholder="Correo electrónico" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black" />
                            </div>
                        </div>
                    )}

                    <button disabled={cart.items.length === 0} onClick={onCheckout} className={`w-full mt-6 rounded-md border border-transparent px-4 py-4 text-base font-bold text-white shadow-sm transition-colors ${cart.items.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}>
                        Pagar ${finalPrice.toFixed(2)} ahora
                    </button>
                </div>

            </div>
        </div>
    </div>
    );
}