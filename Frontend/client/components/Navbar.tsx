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
    const [searchTerm, setSearchTerm] = useState("");
    
    const [isClientLogged, setIsClientLogged] = useState(false);
    const [isAdminLogged, setIsAdminLogged] = useState(false);

    // El useEffect se lee SIEMPRE
    useEffect(() => {
        setIsMounted(true);
        
        const token = localStorage.getItem("token");
        const adminToken = localStorage.getItem("admin_token");
        
        if (token) setIsClientLogged(true);
        if (adminToken) setIsAdminLogged(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (searchTerm.trim()) {
            router.push(`/search?q=${searchTerm}`);
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

    // 2. 👉 LA SALIDA VA AQUÍ, JUSTO ANTES DE RENDERIZAR EL HTML 👈
    if (pathname.startsWith("/admin")) {
        return null;
    }

    // 3. RENDERIZADO VISUAL
    return (
        <div className="border-b border-gray-200 sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                        <p className="font-serif font-bold text-2xl tracking-tight uppercase">Lumière</p>
                    </Link>

                    {/* BARRA DE BÚSQUEDA */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3 border border-transparent focus-within:border-gray-300 transition-colors">
                        <input 
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
                        />
                        <button type="submit" className="text-gray-500 hover:text-black">
                            🔍 
                        </button>
                    </form>

                    {/* ACCIONES (Usuario y Carrito) */}
                    <div className="flex items-center gap-5">
            
                        {isMounted && (
                            <div className="flex items-center gap-3">
                                {isAdminLogged ? (
                                    <div className="flex items-center gap-3">
                                        <Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:underline">
                                            Panel Admin
                                        </Link>
                                    </div>
                                ) : isClientLogged ? (
                                    <div className="flex items-center gap-3">
                                        <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                            Mi Perfil
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <Link href="/login" className="hover:text-black transition-colors">
                                            Ingresar
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <Link href="/register" className="hover:text-black transition-colors">
                                            Registro
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Botón Carrito */}
                        <Link href="/cart" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">
                            {/* 👇 Ícono SVG Profesional */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="font-bold text-sm">
                                {/* 👇 Sumamos las cantidades reales de todos los productos */}
                                {isMounted ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0}
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}