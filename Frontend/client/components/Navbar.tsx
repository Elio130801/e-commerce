"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { useState, useEffect } from "react";

export default function Navbar() {
    const cart = useCart();
    const router = useRouter();
    const pathname = usePathname();
    
    const [isMounted, setIsMounted] = useState(false);
    
    // Estados de autenticación
    const [isClientLogged, setIsClientLogged] = useState(false);
    const [isAdminLogged, setIsAdminLogged] = useState(false);

    // 👇 Nuevos estados para la búsqueda en vivo
    const [searchTerm, setSearchTerm] = useState("");
    const [liveResults, setLiveResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem("token");
        const adminToken = localStorage.getItem("admin_token");
        if (token) setIsClientLogged(true);
        if (adminToken) setIsAdminLogged(true);
    }, []);

    // 👇 MAGIA: El "Debounce" para buscar en vivo mientras el usuario escribe
    useEffect(() => {
        // Si hay menos de 2 letras, no buscamos nada y cerramos la ventana
        if (searchTerm.trim().length < 2) {
            setLiveResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        // Esperamos 300ms después de que el usuario deja de escribir para consultar al backend
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:4000/products?q=${searchTerm}`);
                if (res.ok) {
                    const data = await res.json();
                    setLiveResults(data);
                }
            } catch (error) {
                console.error("Error buscando en vivo:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300); 

        // Limpiamos el temporizador si el usuario sigue escribiendo
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (searchTerm.trim()) {
            setShowDropdown(false); // Cerramos el menú flotante
            router.push(`/search?q=${searchTerm}`); // Llevamos a la pantalla completa
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin_token");
        setIsClientLogged(false);
        setIsAdminLogged(false);
        alert("Has cerrado sesión exitosamente 👋");
        window.location.href = "/";
    };

    if (pathname.startsWith("/admin")) return null;

    return (
        <div className="border-b border-gray-200 sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <p className="font-serif font-bold text-2xl tracking-tight uppercase">Lumière</p>
                    </Link>

                    {/* BARRA DE BÚSQUEDA EN VIVO */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
                        <form onSubmit={handleSearchSubmit} className="w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            <input 
                                type="text"
                                placeholder="¿Qué estás buscando hoy?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => { if (searchTerm.length >= 2) setShowDropdown(true) }}
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all duration-300"
                            />
                            
                            {searchTerm && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowDropdown(false);
                                    }} 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </form>

                        {/* 👇 VENTANA DESPLEGABLE DE RESULTADOS EN VIVO */}
                        {showDropdown && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                {isSearching ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        Buscando...
                                    </div>
                                ) : liveResults.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No encontramos resultados para "{searchTerm}"
                                    </div>
                                ) : (
                                    <>
                                        <ul className="max-h-80 overflow-y-auto">
                                            {liveResults.map((product) => (
                                                <li key={product.id} className="border-b border-gray-50 last:border-none">
                                                    <button 
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            setSearchTerm("");
                                                            router.push(`/products/${product.id}`); // Llevamos directo al producto
                                                        }}
                                                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <img 
                                                            src={product.images?.[0] || "https://via.placeholder.com/50"} 
                                                            alt={product.name} 
                                                            className="w-12 h-12 object-cover rounded-md border border-gray-200 shrink-0" 
                                                        />
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{product.category?.name || "Sin categoría"}</p>
                                                        </div>
                                                        <span className="font-bold text-sm text-black shrink-0">${product.price}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button 
                                                onClick={handleSearchSubmit}
                                                className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800 py-1"
                                            >
                                                Ver todos los {liveResults.length} resultados
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACCIONES (Usuario y Carrito) */}
                    <div className="flex items-center gap-5 shrink-0">
            
                        {isMounted && (
                            <div className="flex items-center gap-3">
                                {isAdminLogged ? (
                                    <Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:underline">
                                        Panel Admin
                                    </Link>
                                ) : isClientLogged ? (
                                    <>
                                        <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                            Mi Perfil
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium transition-colors text-sm">
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                            Ingresar
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                            Registro
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}

                        <Link href="/cart" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="font-bold text-sm">
                                {isMounted ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0}
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}