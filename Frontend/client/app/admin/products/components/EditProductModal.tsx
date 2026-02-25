"use client";

import { useState, useEffect } from "react";

export default function EditProductModal({ isOpen, onClose, onSuccess, categories, product }: any) {
    // Estados del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");

    // Este useEffect "escucha" si le pasamos un producto. Si lo hay, rellena los campos automáticamente.
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setStock(product.stock?.toString() || "");
            setImageUrl(product.images?.[0] || "");
            if (product.category) {
                setCategoryId(product.category.id);
            } else {
                setCategoryId("");
            }
        }
    }, [product]);

    // Si el modal no está abierto, o si no hay un producto seleccionado, no renderizamos nada
    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        const generatedSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

        try {
            const response = await fetch(`http://localhost:4000/products/${product.id}`, {
                method: "PATCH",
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
                    // Enviamos un array vacío si no hay imagen
                    images: imageUrl ? [imageUrl] : [],
                    categoryId: categoryId,
                }),
            });

            if (response.ok) {
                alert("¡Producto actualizado con éxito! ✏️");
                onSuccess(); // Avisamos a la tabla principal que recargue los productos
                onClose();   // Cerramos el modal
            } else {
                alert("Hubo un error al actualizar el producto.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }
    };

    return (
        // Aquí está el Glassmorphism (backdrop-blur-sm y bg-black/20)
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20 transition-all duration-300">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* CABECERA */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">Editar Producto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl transition-colors">
                        ×
                    </button>
                </div>
                
                {/* CUERPO DEL FORMULARIO CON SCROLL */}
                <div className="p-6 overflow-y-auto">
                    <form id="editForm" onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* NOMBRE: Solo letras, números y espacios */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setName(val);
                                }} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" 
                            />
                        </div>
                        
                        {/* DESCRIPCIÓN: Solo letras, números y espacios */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                required 
                                value={description} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setDescription(val);
                                }} 
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black h-20" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* PRECIO: Solo números y decimales */}
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

                            {/* STOCK: Solo números enteros */}
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
                                {categories && categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* URL DE IMAGEN: Opcional, le quitamos el required */}
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

                {/* BOTONES FINALES */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                        Cancelar
                    </button>
                    {/* Botón azul para diferenciar visualmente que estamos EDITANDO y no CREANDO */}
                    <button type="submit" form="editForm" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-bold">
                        Actualizar Producto
                    </button>
                </div>
            </div>
        </div>
    );
}