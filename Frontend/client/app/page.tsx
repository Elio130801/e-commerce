import { Product } from "@/types"; 
import Link from "next/link";

// 1. Función para pedir datos al Backend (NestJS)
async function getProducts() {
  // Asegúrate de que esta URL sea donde corre tu Backend
  const res = await fetch('http://localhost:4000/products', {
    cache: 'no-store' // Para que no guarde caché y siempre traiga datos frescos
  });

  if (!res.ok) {
    throw new Error('Falló la carga de productos');
  }

  return res.json();
}

export default async function Home() {
  // 2. Ejecutamos la función (¡Mira qué fácil!)
  const products: Product[] = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Colección Lumière
        </h1>

        {/* 3. GRILLA DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
              
              {/* Imagen (Usamos la primera del array o una por defecto) */}
              <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
                <img 
                  src={product.images[0] || "https://via.placeholder.com/300"} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {!product.isActive && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</span>
                )}
              </div>

              {/* Textos */}
              <h2 className="text-lg font-medium text-gray-900 truncate">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
              
              {/* Precio */}
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

      </div>
    </main>
  );
}