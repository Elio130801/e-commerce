import { Product } from "../types"; 
import Link from "next/link";
import ProductCard from "@/components/ProductCard"; 
import FilterSidebar from "@/components/FilterSidebar";

async function getProducts(queryString: string) {
  // Ahora el backend recibe los filtros en la URL y hace el trabajo pesado
  const res = await fetch(`http://localhost:4000/products?${queryString}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de productos');
  return res.json();
}

async function getCategories() {
  const res = await fetch('http://localhost:4000/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falló la carga de categorías');
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  // En Next.js 15, searchParams es una promesa
  const params = await searchParams;
  
  // Extraemos la categoría seleccionada para pintar el botón activo
  const selectedCategoryId = params.category;
  
  // Convertimos todos los parámetros en un string para mandarlo al backend
  const queryString = new URLSearchParams(params).toString();
  
  const products: Product[] = await getProducts(queryString);
  const categories: any[] = await getCategories();

  // Función mágica: Permite cambiar de categoría sin borrar el precio ni la búsqueda
  const createCategoryUrl = (categoryId: string) => {
    const newParams = new URLSearchParams(params);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category'); // Para el botón "Todos"
    }
    return `/?${newParams.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-gray-800 mb-8 text-center">
          Colección Lumière
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 👈 COLUMNA IZQUIERDA: Barra Lateral de Filtros */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSidebar categories={categories} />
          </div>

          {/* 👉 COLUMNA DERECHA: Categorías y Grilla de Productos */}
          <div className="flex-1">
            
            {/* BARRA DE CATEGORÍAS (Tu diseño original mejorado) */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link 
                href={createCategoryUrl('')}
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
                  href={createCategoryUrl(cat.id)}
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

            {/* GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* MENSAJE DE ESTADO VACÍO */}
            {products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mt-6">
                <h3 className="text-lg text-gray-500 font-medium">No hay productos que coincidan con los filtros</h3>
                <p className="text-gray-400 text-sm mt-1">Intenta ajustar el precio, la búsqueda o cambia de categoría.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}