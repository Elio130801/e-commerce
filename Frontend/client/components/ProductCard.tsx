import Link from "next/link";
import { Product } from "@/types";
import WishlistIconButton from "@/components/ui/wishlist-icon-button";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 flex flex-col relative group">
            
            {/* 👇 El Botón de Corazón integrado */}
            <WishlistIconButton data={product} />

            {/* Imagen */}
            <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
                <img 
                    src={product.images?.[0] || "https://via.placeholder.com/300"} 
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {!product.isActive && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</span>
                )}
            </div>

            {/* Textos */}
            <div className="flex-1">
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
            
            {/* Precio y Botón */}
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
    );
}