import { Product } from "@/types";
import Link from "next/link";

// Pide los productos al backend enviando la query 'q'
async function getSearchResults(query: string) {
    const res = await fetch(`http://localhost:4000/products?q=${query}`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
}

type Props = {
    searchParams: Promise<{ q: string }>
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams; // Esperamos los parámetros (Next.js 15)
    const products: Product[] = await getSearchResults(q || "");

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-serif text-gray-800 mb-2">
                    Resultados para: "{q}"
                </h1>
                <p className="text-gray-500 mb-8">{products.length} productos encontrados</p>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">No encontramos nada con esa palabra 😔</p>
                        <Link href="/" className="text-black font-semibold hover:underline mt-4 inline-block">
                            Volver a la tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                                <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
                                    <img 
                                        src={product.images[0] || "https://via.placeholder.com/300"} 
                                        alt={product.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h2 className="text-lg font-medium text-gray-900 truncate">
                                    {product.name}
                                </h2>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900">
                                        ${product.price}
                                    </span>
                                    <Link 
                                        href={`/products/${product.id}`}
                                        className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                                    >
                                        Ver
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}