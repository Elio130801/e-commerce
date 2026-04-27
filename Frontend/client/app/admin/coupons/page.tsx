"use client";

import { useState, useEffect } from "react";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");

    const fetchCoupons = async () => {
        try {
            const res = await fetch("http://localhost:4000/coupons");
            if (res.ok) setCoupons(await res.json());
        } catch (error) {
            console.error("Error cargando cupones:", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    code: code.toUpperCase().trim(), 
                    discountPercentage: Number(discount) 
                }),
            });

            if (res.ok) {
                setCode("");
                setDiscount("");
                fetchCoupons();
            } else {
                alert("Hubo un error (Quizás el código ya existe)");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que quieres eliminar este cupón?")) return;
        try {
            const res = await fetch(`http://localhost:4000/coupons/${id}`, { method: "DELETE" });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Cupones</h1>

                {/* CREAR CUPÓN */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Descuento</h3>
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-gray-500 mb-1">Código (Ej: VERANO20)</label>
                            <input 
                                type="text" 
                                required 
                                value={code} 
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-black"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-gray-500 mb-1">Descuento (%)</label>
                            <input 
                                type="number" 
                                required 
                                min="1" 
                                max="100"
                                value={discount} 
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-black"
                            />
                        </div>
                        <button type="submit" className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors h-[42px] font-medium">
                            + Crear Cupón
                        </button>
                    </form>
                </div>

                {/* LISTA DE CUPONES */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">-{coupon.discountPercentage}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Activo</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDelete(coupon.id)} className="text-red-600 hover:text-red-900 font-medium">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {coupons.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No tienes cupones creados aún.</div>
                    )}
                </div>

            </div>
        </div>
    );
}