"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileSidebar from "@/components/ProfileSidebar"; 
import ProfileData from "@/components/ProfileData";
import ProfileSecurity from "@/components/ProfileSecurity";

export default function ProfilePage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("Mi Cuenta");
    const [isLoading, setIsLoading] = useState(true);
    
    // 👇 NUEVO: Estado para controlar qué pestaña vemos a la derecha
    const [activeTab, setActiveTab] = useState("pedidos");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        let userId = "";

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            userId = payload.sub; // Guardamos el ID para usarlo en la petición
            
            // Ponemos los datos del token temporalmente mientras carga la BD
            setUserEmail(payload.email);
            if (payload.fullName || payload.name) {
                setUserName(payload.fullName || payload.name);
            }
        } catch (e) {
            console.error("Error leyendo token:", e);
            return;
        }

        // 👇 NUEVA FUNCIÓN: Traer los datos frescos de la base de datos
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUserName(userData.fullName); // Pisamos el nombre viejo con el fresco
                    setUserEmail(userData.email);
                }
            } catch (error) {
                console.error("Error trayendo datos del usuario:", error);
            }
        };

        const fetchMyOrders = async () => {
            try {
                const response = await fetch("http://localhost:4000/orders/my-orders", {
                    headers: { 'Authorization': `Bearer ${token}` }
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

        fetchUserData(); // Llamamos a la BD por los datos
        fetchMyOrders(); // Llamamos a la BD por los pedidos
    }, [router]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">✅ Pagado</span>;
            case 'PENDING': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">⏳ Pendiente</span>;
            case 'ENVIADO': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">🚚 Enviado</span>;
            case 'ENTREGADO': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">🎁 Entregado</span>;
            case 'CANCELADO': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">❌ Cancelado</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse text-gray-500 font-medium">Cargando tu perfil...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: COMPONENTE SIDEBAR */}
                    <div className="lg:col-span-1">
                        <ProfileSidebar 
                            userName={userName}
                            userEmail={userEmail}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    {/* COLUMNA DERECHA: CONTENIDO DINÁMICO */}
                    <div className="lg:col-span-3">
                        
                        {/* PESTAÑA 1: MIS PEDIDOS */}
                        {activeTab === 'pedidos' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    🛍️ Mis Pedidos
                                </h2>
                                
                                {orders.length === 0 ? (
                                    <div className="bg-white text-center py-16 border border-gray-200 rounded-2xl shadow-sm">
                                        <div className="text-4xl mb-4">🛒</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Aún no has comprado nada</h3>
                                        <p className="text-gray-500 mb-6">Explora nuestro catálogo y encuentra lo que buscas.</p>
                                        <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-shadow shadow-md">
                                            Ir a la tienda
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Orden #{order.id.substring(0,8)}</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 md:text-right">
                                                        <p className="text-lg font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                                                        <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                                <ul className="divide-y divide-gray-100">
                                                    {order.items.map((item: any, index: number) => (
                                                        <li key={index} className="p-6 flex items-center gap-6">
                                                            <div className="h-20 w-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                                {item.images && item.images[0] ? (
                                                                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Sin foto</div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-base font-bold text-gray-900">{item.name}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity || 1}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-gray-900">${Number(item.price).toFixed(2)}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PESTAÑA 2: MIS DATOS */}
                        {activeTab === 'datos' && (
                            <ProfileData userName={userName} userEmail={userEmail} />
                        )}

                        {/* PESTAÑA 3: SEGURIDAD */}
                        {activeTab === 'seguridad' && (
                            <ProfileSecurity />
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}