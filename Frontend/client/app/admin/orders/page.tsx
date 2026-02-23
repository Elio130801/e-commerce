"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // Para el popup de detalles

    // 1. Función para pedir las órdenes al Backend
    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:4000/orders', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error al cargar las ventas:", error);
        }
    };

    // Se ejecuta al cargar la página
    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. Función para cambiar el estado (PATCH al Backend)
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost:4000/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert(`¡Estado actualizado a ${newStatus}! 🚀`);
                fetchOrders(); // Recargamos la tabla para ver el cambio
            } else {
                alert("Hubo un error al actualizar el estado.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
        
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Ventas</h1>
                </div>

                {/* TABLA DE ÓRDENES */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Orden</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Cargando ventas o aún no hay registros...
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* SELECTOR PARA CAMBIAR ESTADO */}
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-bold rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-black outline-none cursor-pointer
                                                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order.status === 'ENVIADO' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${order.status === 'ENTREGADO' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order.status === 'CANCELADO' ? 'bg-red-100 text-red-800' : ''}
                                                `}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="ENVIADO">ENVIADO</option>
                                                <option value="ENTREGADO">ENTREGADO</option>
                                                <option value="CANCELADO">CANCELADO</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {/* BOTÓN PARA ABRIR EL MODAL */}
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-black font-medium hover:underline"
                                            >
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL (POPUP) PARA VER PRODUCTOS */}
                {selectedOrder && (
                    // 👇 Aquí está la magia: backdrop-blur-sm desenfoca, y bg-black/10 oscurece un 10%
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/10 transition-all duration-300">
                        
                        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Detalles de la Orden
                                </h3>
                                <button 
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-red-500 font-bold text-xl transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Productos Comprados:</h4>
                                <ul className="divide-y divide-gray-100">
                                    {selectedOrder.items.map((item: any, index: number) => (
                                        <li key={index} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                            </div>
                                            <span className="text-gray-600 font-medium">${Number(item.price).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total pagado:</span>
                                    <span className="font-bold text-xl text-black">${Number(selectedOrder.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}