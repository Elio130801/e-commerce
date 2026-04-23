"use client";

import { useState } from "react";

export default function CreateProductModal({ isOpen, onClose, onSuccess, categories }: any) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        const generatedSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

        try {
            const response = await fetch("http://localhost:4000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name, 
                    description, 
                    price: Number(price), 
                    stock: Number(stock),
                    slug: generatedSlug, 
                    images: imageUrl ? [imageUrl] : [], 
                    categoryId, 
                    isActive: true,
                }),
            });

            if (response.ok) {
                alert("¡Producto creado con éxito! 🚀");
                setName(""); setDescription(""); setPrice(""); setStock(""); setImageUrl(""); setCategoryId("");
                onSuccess(); 
                onClose();   
            } else {
                alert("Hubo un error al crear el producto.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20 transition-all duration-300">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">Nuevo Producto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <form id="createForm" onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* NOMBRE: Liberado de restricciones */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                // 👇 Cambio aquí: Actualiza el estado directamente sin bloqueos
                                onChange={(e) => setName(e.target.value)} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" 
                            />
                        </div>

                        {/* DESCRIPCIÓN: Liberado de restricciones */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                required 
                                value={description} 
                                // 👇 Cambio aquí: Actualiza el estado directamente sin bloqueos
                                onChange={(e) => setDescription(e.target.value)} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black h-20" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* PRECIO: Mantenemos la regla para que solo sean números y un punto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Precio ($) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={price} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*\.?\d*$/.test(val)) setPrice(val);
                                    }} 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" 
                                />
                            </div>

                            {/* STOCK: Mantenemos la regla para que solo sean números enteros */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={stock} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) setStock(val);
                                    }} 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" 
                                />
                            </div>
                        </div>

                        {/* CATEGORÍA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select 
                                required 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black bg-white"
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* URL DE IMAGEN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                URL de la Imagen <span className="text-gray-400 font-normal">(Opcional)</span>
                            </label>
                            <input 
                                type="url" 
                                value={imageUrl} 
                                onChange={(e) => setImageUrl(e.target.value)} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" 
                            />
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">Cancelar</button>
                    <button type="submit" form="createForm" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-sm">Guardar Producto</button>
                </div>
            </div>
        </div>
    );
}