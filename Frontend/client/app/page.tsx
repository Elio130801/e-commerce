import { Product } from "../types"; 
import Link from "next/link";

// 1. Funciones para pedir datos al Backend
async function getProducts() {
  const res = await fetch('http://localhost:4000/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de productos');
  return res.json();
}

// 👇 NUEVO: Traemos las categorías 👇
async function getCategories() {
  const res = await fetch('http://localhost:4000/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de categorías');
  return res.json();
}

// 👇 NUEVO: Next.js nos regala "searchParams" para leer la URL 👇
export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  
  // 2. Ejecutamos ambas peticiones al mismo tiempo
  const products: Product[] = await getProducts();
  const categories: any[] = await getCategories();

  // 3. Vemos qué categoría eligió el usuario en la URL
  const params = await searchParams;
  const selectedCategoryId = params.category;

  // 4. Si hay una categoría en la URL, filtramos la lista. Si no, mostramos todos.
  const filteredProducts = selectedCategoryId 
    ? products.filter((p) => p.category?.id === selectedCategoryId)
    : products;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Colección Lumière
        </h1>

        {/* 👇 NUEVO: BARRA DE FILTROS 👇 */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          
          {/* Botón para ver "Todos" (Limpia la URL) */}
          <Link 
            href="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
              !selectedCategoryId 
                ? "bg-black text-white border-black shadow-md" 
                : "bg-white text-gray-600 border-gray-200 hover:border-black"
            }`}
          >
            Todos
          </Link>

          {/* Botones dinámicos para cada categoría */}
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategoryId === cat.id 
                  ? "bg-black text-white border-black shadow-md" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-black"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        {/* 👆 FIN BARRA DE FILTROS 👆 */}

        {/* GRILLA DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 flex flex-col">
              
              {/* Imagen */}
              <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
                <img 
                  src={product.images[0] || "https://via.placeholder.com/300"} 
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {!product.isActive && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</span>
                )}
              </div>

              {/* Textos */}
              <div className="flex-1">
                {/* Etiqueta de la categoría chiquita arriba del nombre */}
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {product.category?.name || "Sin categoría"}
                </span>
                <h2 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>
              
              {/* Precio y Botón (siempre abajo) */}
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <Link 
                  href={`/products/${product.slug}`}
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                  Ver Detalles
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* 👇 NUEVO: Mensaje si la categoría está vacía 👇 */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-600 font-medium">No hay productos en esta categoría</h3>
            <p className="text-gray-400 mt-2">Explora otras categorías o vuelve a ver todos los productos.</p>
          </div>
        )}

      </div>
    </main>
  );
}