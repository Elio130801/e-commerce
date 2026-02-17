import { Product } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation"; 
import AddToCartButton from "@/components/ui/add-to-cart-button";
// Función para pedir datos
async function getProduct(id: string) {
    const res = await fetch(`http://localhost:4000/products/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
}

// ⚠️ CAMBIO IMPORTANTE AQUÍ EN LOS TIPOS:
type Props = {
    params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
        // 1. ⚠️ AHORA TENEMOS QUE ESPERAR (AWAIT) LOS PARAMS
        const { id } = await params;

    // 2. Ahora sí usamos el ID real
    const product: Product = await getProduct(id);

    // 3. Si no existe, usamos la pantalla de error de Next.js
    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Producto no encontrado 😔</h1>
                <Link href="/" className="text-blue-500 hover:underline">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
        
                <Link href="/" className="text-gray-500 hover:text-black mb-8 inline-block">
                    ← Volver a la tienda
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

                    {/* Imagen */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-8 lg:mb-0">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            {product.name}
                        </h1>
            
                    <div className="mt-3">
                        <p className="text-3xl text-gray-900">${product.price}</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-base text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-6">
                        {product.isActive ? (
                            <p className="text-green-600 font-semibold flex items-center gap-2">
                                ● Disponible en stock
                            </p>
                        ) : (
                            <p className="text-red-600 font-semibold">
                                ○ Agotado temporalmente
                            </p>
                        )}
                    </div>

                    <div className="mt-10">
                        <div className="mt-10">
                            <AddToCartButton data={product} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
}