"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.email);
        } catch (e) {
            console.error("Error leyendo token");
        }

        const fetchMyOrders = async () => {
            try {
                const response = await fetch("http://localhost:4000/orders/my-orders", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error trayendo órdenes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, [router]);

    if (isLoading) return <div className="text-center mt-20">Cargando tu perfil...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* CABECERA DEL PERFIL */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
                <p className="text-gray-600"><strong>Email conectado:</strong> {userEmail}</p>
            </div>

            {/* HISTORIAL DE COMPRAS */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Compras</h2>
            
            {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-4">Aún no has realizado ninguna compra.</p>
                    <Link href="/" className="text-black font-semibold hover:underline">
                        Ir a la tienda
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            
                            {/* INFO DE LA ORDEN */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Orden ID: <span className="font-mono text-xs">{order.id}</span></p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        Fecha: {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Estado: <span className="font-bold text-black">{order.status}</span></p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">Total: ${Number(order.total).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* PRODUCTOS COMPRADOS */}
                            <ul className="divide-y divide-gray-200">
                                {order.items.map((item: any, index: number) => (
                                    <li key={index} className="p-6 flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}