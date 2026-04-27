"use client";

import { useState, useEffect } from "react";
import { 
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
    ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export default function AdminDashboard() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch("http://localhost:4000/products"),
                    fetch("http://localhost:4000/categories")
                ]);
                if (prodRes.ok) setProducts(await prodRes.json());
                if (catRes.ok) setCategories(await catRes.json());
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // LOGICA DE DATOS
    const lowStockData = [...products]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6)
        .map(p => ({ name: p.name.substring(0, 12), stock: p.stock }));

    const categoryData = categories.map(cat => ({
        name: cat.name,
        value: products.filter(p => p.category?.id === cat.id).length
    })).filter(c => c.value > 0);

    const COLORS = ['#000000', '#D4AF37', '#4B5563', '#9CA3AF', '#1F2937'];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando métricas de Lumière...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Tablero de Control</h1>
                    <p className="text-gray-500 mt-1">Resumen general del inventario y catálogo de la boutique.</p>
                </header>

                {/* TARJETAS RÁPIDAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Productos</p>
                        <h2 className="text-4xl font-bold text-black mt-2">{products.length}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categorías Activas</p>
                        <h2 className="text-4xl font-bold text-black mt-2">{categories.length}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Total</p>
                        <h2 className="text-4xl font-bold text-black mt-2">
                            {products.reduce((acc, p) => acc + p.stock, 0)}
                        </h2>
                    </div>
                </div>

                {/* GRÁFICOS PRINCIPALES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* DISTRIBUCIÓN POR CATEGORÍA */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución del Catálogo</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ALERTA DE STOCK BAJO */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Alertas de Reabastecimiento</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={lowStockData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} />
                                    <Tooltip cursor={{fill: '#f9fafb'}} />
                                    <Bar dataKey="stock" fill="#000000" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}