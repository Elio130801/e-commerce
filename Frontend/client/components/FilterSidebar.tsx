"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"; // Necesitarás: npm install use-debounce

export default function FilterSidebar({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados locales para los filtros
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    
    // Debounce para no saturar el servidor mientras el usuario escribe
    const [debouncedSearch] = useDebounce(search, 500);
    const [debouncedMin] = useDebounce(minPrice, 500);
    const [debouncedMax] = useDebounce(maxPrice, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (debouncedSearch) params.set("q", debouncedSearch); else params.delete("q");
        if (debouncedMin) params.set("minPrice", debouncedMin); else params.delete("minPrice");
        if (debouncedMax) params.set("maxPrice", debouncedMax); else params.delete("maxPrice");

        router.push(`/?${params.toString()}`);
    }, [debouncedSearch, debouncedMin, debouncedMax, router]);

    return (
        <div className="w-full md:w-64 space-y-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-20">
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Búsqueda</h3>
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="¿Qué buscas?"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Rango de Precio</h3>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="number" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>

            <button 
                onClick={() => {
                    setSearch(""); setMinPrice(""); setMaxPrice("");
                    router.push("/");
                }}
                className="w-full text-xs text-gray-400 hover:text-black underline transition-colors"
            >
                Limpiar filtros
            </button>
        </div>
    );
}