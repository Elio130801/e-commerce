import { Product } from "@/types"; 
import Link from "next/link";
import ProductCard from "@/components/ProductCard"; 
import FilterSidebar from "@/components/FilterSidebar";

export default async function ShopPage({ searchParams }: { searchParams: Promise<any> }) {
  try {
    // 1. Resolvemos los parámetros con seguridad
    const params = await searchParams;
    const safeParams = params || {};
    const selectedCategoryId = safeParams.category;
    
    // Convertimos los parámetros para enviarlos al backend
    const queryString = new URLSearchParams(safeParams as Record<string, string>).toString();

    // 2. Traemos los productos
    const resProducts = await fetch(`http://localhost:4000/products?${queryString}`, { cache: 'no-store' });
    if (!resProducts.ok) throw new Error(`Falló la carga de productos. Estado: ${resProducts.status}`);
    const products: Product[] = await resProducts.json();

    // 3. Traemos las categorías
    const resCategories = await fetch('http://localhost:4000/categories', { cache: 'no-store' });
    if (!resCategories.ok) throw new Error(`Falló la carga de categorías. Estado: ${resCategories.status}`);
    const categories: any[] = await resCategories.json();

    // 4. Función de la URL
    const createCategoryUrl = (categoryId: string) => {
      const newParams = new URLSearchParams(safeParams as Record<string, string>);
      if (categoryId) {
        newParams.set('category', categoryId);
      } else {
        newParams.delete('category'); 
      }
      return `/shop?${newParams.toString()}`;
    };

    // Si todo sale bien, cargamos la tienda:
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif text-gray-800 mb-8 text-center">Tienda Oficial</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 shrink-0">
              <FilterSidebar categories={categories} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={createCategoryUrl('')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${!selectedCategoryId ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"}`}>Todos</Link>
                {categories.map((cat) => (
                  <Link key={cat.id} href={createCategoryUrl(cat.id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategoryId === cat.id ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );

  } catch (error: any) {
    // SI ALGO FALLA, VEREMOS ESTO EN PANTALLA
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 border border-red-200 rounded-xl shadow-sm text-center max-w-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Detectamos un error interno</h1>
          <p className="text-gray-700 mb-4">La página intentó cargar pero algo falló en el código:</p>
          <code className="bg-red-50 text-red-800 p-4 rounded-md block text-sm overflow-auto text-left">
            {error.message || String(error)}
          </code>
        </div>
      </div>
    );
  }
}