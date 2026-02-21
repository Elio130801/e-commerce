"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Obtenemos el ID de la URL

    // Estados del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    // Cargar categorías y datos del producto al entrar a la página
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Traer categorías
                const catRes = await fetch("http://localhost:4000/categories");
                if (catRes.ok) setCategories(await catRes.json());

                // 2. Traer el producto a editar
                const prodRes = await fetch(`http://localhost:4000/products/${id}`);
                if (prodRes.ok) {
                    const product = await prodRes.json();
                    // Llenamos los campos con los datos de la base de datos
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price.toString());
                    setStock(product.stock.toString());
                    setImageUrl(product.images[0]); // Asumimos que la primera es la principal
                    if (product.category) setCategoryId(product.category.id);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

    fetchData();
}, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        const generatedSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

        try {
            // Usamos PATCH para actualizar
            const response = await fetch(`http://localhost:4000/products/${id}`, {
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
                    images: [imageUrl],
                    categoryId: categoryId,
                }),
            });

            if (response.ok) {
                alert("¡Producto actualizado con éxito! ✏️");
                router.push("/admin/products"); // Volvemos a la tabla
            } else {
                alert("Hubo un error al actualizar el producto.");
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
                    <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
                    <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
                        Volver a la lista
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black h-24" />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black bg-white">
                            <option value="" disabled>Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                            <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                        </div>
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                        <input type="url" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                        {imageUrl && <img src={imageUrl} alt="Vista previa" className="mt-4 h-32 object-contain rounded-md border border-gray-200 p-2" />}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Actualizar Producto
                    </button>
                </form>
            </div>
        </div>
    );
}