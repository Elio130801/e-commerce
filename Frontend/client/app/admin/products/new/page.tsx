"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();

    // Estados para guardar lo que el admin escribe
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [stock, setStock] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const generatedSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

        try {
            // Enviamos el nuevo producto al Backend
            const response = await fetch("http://localhost:4000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Nota: Si tu ruta POST tiene AuthGuard en el backend, 
                    // necesitaremos enviar el Token aquí más adelante.
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: Number(price), // Convertimos el texto a número
                    stock: Number(stock),
                    slug: generatedSlug, // Usamos el slug generado automáticamente
                    images: [imageUrl], // Lo metemos en un array como pide el backend
                    isActive: true,
                }),
            });

        if (response.ok) {
            alert("¡Producto creado con éxito! 🚀");
            router.push("/"); // Volvemos a la tienda para ver el producto nuevo
        } else {
            alert("Hubo un error al crear el producto.");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    }
};

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
                    <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                        Volver a Ventas
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                            placeholder="Ej: Sérum Vitamina C"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black h-24"
                            placeholder="Detalles del producto..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock (Unidades disponibles)</label>
                        <input
                            type="number"
                            required
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                            placeholder="Ej: 50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                            placeholder="Ej: 45.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                        <input
                            type="url"
                            required
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Guardar Producto
                    </button>
                </form>

            </div>
        </div>
    );
}