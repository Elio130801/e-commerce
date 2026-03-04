"use client";

import { useEffect, useState } from "react";
// 👇 Importamos Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("ALL"); 
    
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost:4000/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders(); 
            } else {
                alert("Hubo un error al actualizar el estado.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const delimiter = ";";
        const headers = ["ID Orden", "Fecha", "Cliente", "Email", "Total Pagado", "Estado", "Productos Comprados"];

        const rows = filteredOrders.map(order => {
            const date = new Date(order.createdAt).toLocaleDateString('es-ES');
            const productsInfo = order.items.map((item: any) => `${item.quantity || 1}x ${item.name}`).join(' | ');
            const totalFormatted = Number(order.total).toFixed(2).replace('.', ',');

            return [
                order.id,
                date,
                `"${order.customerName}"`, 
                order.customerEmail,
                totalFormatted, 
                order.status,
                `"${productsInfo}"`
            ].join(delimiter); 
        });

        const csvContent = [headers.join(delimiter), ...rows].join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_Ventas_Lumiere_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

        let matchesDate = true;
        
        if (order.createdAt) {
            const orderDate = new Date(order.createdAt).getTime();
            if (startDate) {
                const [year, month, day] = startDate.split('-');
                const start = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0).getTime();
                if (orderDate < start) matchesDate = false;
            }
            if (endDate) {
                const [year, month, day] = endDate.split('-');
                const end = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999).getTime();
                if (orderDate > end) matchesDate = false;
            }
        }
        return matchesSearch && matchesStatus && matchesDate;
    });

    const totalRevenue = orders
        .filter(o => ['PAID', 'ENVIADO', 'ENTREGADO'].includes(o.status)) 
        .reduce((sum, order) => sum + Number(order.total), 0);
    
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;

    // 👇 PROCESAMIENTO DE DATOS PARA LOS GRÁFICOS
    // 1. Datos para el Gráfico de Torta (Estado de Pedidos)
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
    const PIE_COLORS: Record<string, string> = { 
        PENDING: '#fbbf24', // Yellow
        PAID: '#4ade80',    // Green
        ENVIADO: '#60a5fa', // Blue
        ENTREGADO: '#c084fc', // Purple
        CANCELADO: '#f87171'  // Red
    };

    // 2. Datos para el Gráfico de Líneas (Ingresos últimos 7 días)
    const getLast7DaysData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
            
            // Sumar ingresos solo de ese día (y órdenes exitosas)
            const dayOrders = orders.filter(o => 
                o.createdAt && 
                o.createdAt.startsWith(dateStr) && 
                ['PAID', 'ENVIADO', 'ENTREGADO'].includes(o.status)
            );
            const dayTotal = dayOrders.reduce((sum, o) => sum + Number(o.total), 0);
            
            data.push({
                name: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }), // Ej: "mié 4"
                Ingresos: dayTotal
            });
        }
        return data;
    };
    const lineChartData = getLast7DaysData();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
        
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
                    
                    <button 
                        onClick={exportToCSV}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar Reporte
                    </button>
                </div>

                {/* Tarjetas de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ingresos Totales</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Pedidos</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pedidos Pendientes</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                    </div>
                </div>

                {/* 👇 NUEVO: SECCIÓN DE GRÁFICOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Gráfico de Líneas - Ocupa 2 columnas */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Ingresos de los últimos 7 días</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <Line type="monotone" dataKey="Ingresos" stroke="#000000" strokeWidth={3} activeDot={{ r: 8 }} />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Ingresos']} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Torta - Ocupa 1 columna */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Estado de Pedidos</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#d1d5db'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* CONTROLES DE FILTROS */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Buscar por cliente, email o ID de orden..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white font-medium text-gray-700 cursor-pointer"
                        >
                            <option value="ALL">🛒 Todos los estados</option>
                            <option value="PENDING">⏳ Pendientes (PENDING)</option>
                            <option value="PAID">✅ Pagados (PAID)</option>
                            <option value="ENVIADO">🚚 Enviados</option>
                            <option value="ENTREGADO">🎁 Entregados</option>
                            <option value="CANCELADO">❌ Cancelados</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center gap-2 w-full md:w-1/2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Desde:</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-1/2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Hasta:</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>
                        {(startDate || endDate) && (
                            <button 
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                                className="text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
                            >
                                Limpiar fechas
                            </button>
                        )}
                    </div>
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
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        No se encontraron resultados para los filtros seleccionados...
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order: any) => (
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
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-bold rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-black outline-none cursor-pointer appearance-none text-center
                                                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order.status === 'ENVIADO' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${order.status === 'ENTREGADO' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${order.status === 'CANCELADO' ? 'bg-red-100 text-red-800' : ''}
                                                `}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PAID">PAID (Pagado)</option>
                                                <option value="ENVIADO">ENVIADO</option>
                                                <option value="ENTREGADO">ENTREGADO</option>
                                                <option value="CANCELADO">CANCELADO</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

                {/* MODAL (POPUP) INTACTO */}
                {selectedOrder && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/10 transition-all duration-300">
                        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-900">Detalles de la Orden</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 font-bold text-xl transition-colors">×</button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Productos Comprados:</h4>
                                <ul className="divide-y divide-gray-100">
                                    {selectedOrder.items.map((item: any, index: number) => (
                                        <li key={index} className="py-3 flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{item.name}</span>
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