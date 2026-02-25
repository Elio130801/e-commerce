"use client";

import { useState, useEffect } from "react";
// 👇 Importamos nuestros nuevos componentes separados
import CreateProductModal from "./components/CreateProductModal";
import EditProductModal from "./components/EditProductModal";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    
    // Estados para controlar qué modal se abre
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    // Función para traer productos y categorías al mismo tiempo
    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch("http://localhost:4000/products"),
                fetch("http://localhost:4000/categories")
            ]);
            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Le pasamos el producto seleccionado al estado y abrimos el modal de editar
    const openEditModal = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("admin_token");
        try {
            const response = await fetch(`http://localhost:4000/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                alert("Producto eliminado correctamente 🗑️");
                fetchData();
            } else {
                alert("Hubo un error al eliminar el producto.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
        
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                    <button 
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        + Nuevo Producto
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={product.images && product.images[0] ? product.images[0] : ""} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">{product.category?.name || 'Sin categoría'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock} un.</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => openEditModal(product)} 
                                                className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)} 
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {products.length === 0 && (
                            <div className="text-center py-10 text-gray-500">No hay productos cargados todavía.</div>
                        )}
                    </div>
                </div>

                {/* 👇 AQUÍ INYECTAMOS NUESTROS COMPONENTES SEPARADOS */}
                <CreateProductModal 
                    isOpen={isCreateOpen} 
                    onClose={() => setIsCreateOpen(false)} 
                    onSuccess={fetchData} 
                    categories={categories} 
                />

                <EditProductModal 
                    isOpen={isEditOpen} 
                    onClose={() => setIsEditOpen(false)} 
                    onSuccess={fetchData} 
                    categories={categories} 
                    product={selectedProduct} 
                />

            </div>
        </div>
    );
}