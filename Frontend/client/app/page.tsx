import { Product } from "../types"; 
import Link from "next/link";
import ProductCard from "@/components/ProductCard"; // 👇 Importamos el nuevo componente

async function getProducts() {
  const res = await fetch('http://localhost:4000/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de productos');
  return res.json();
}

async function getCategories() {
  const res = await fetch('http://localhost:4000/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de categorías');
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  const products: Product[] = await getProducts();
  const categories: any[] = await getCategories();

  const params = await searchParams;
  const selectedCategoryId = params.category;

  const filteredProducts = selectedCategoryId 
    ? products.filter((p) => p.category?.id === selectedCategoryId)
    : products;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Colección Lumière
        </h1>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
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

        {/* 👇 GRILLA DE PRODUCTOS SÚPER LIMPIA 👇 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mensaje si la categoría está vacía */}
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