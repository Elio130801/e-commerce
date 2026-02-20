"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);

    // Función para traer los productos
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:4000/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    };

    // Se ejecuta al cargar la página
    useEffect(() => {
        fetchProducts();
    }, []);

    // Función para ELIMINAR un producto
    const handleDelete = async (id: string) => {
        // 1. Pedimos confirmación para no borrar por accidente
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        if (!confirmDelete) return;

        // 2. Buscamos la llave del administrador
        const token = localStorage.getItem("admin_token");

        try {
            const response = await fetch(`http://localhost:4000/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` // Le mostramos la llave al backend
                },
            });

            if (response.ok) {
                alert("Producto eliminado correctamente 🗑️");
                fetchProducts(); // Recargamos la tabla automáticamente
            } else {
                alert("Hubo un error al eliminar el producto. Revisa si tu token es válido.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                    <div className="flex gap-4">
                        <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-black py-2">
                            Ver Ventas
                        </Link>
                        <Link 
                            href="/admin/products/new" 
                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.category?.name || 'Sin categoría'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.stock} un.
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* El botón de editar lo conectaremos en el próximo paso */}
                                        <Link 
                                            href={`/admin/products/edit/${product.id}`} 
                                            className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                        >
                                            Editar
                                        </Link>
                    
                                        {/* Botón de eliminar */}
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No hay productos cargados todavía.</div>
                    )}
                </div>

            </div>
        </div>
    );
}