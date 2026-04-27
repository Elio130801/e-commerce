"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        alert("Sesión cerrada correctamente 👋");
        window.location.href = "/login";
    };

    const isActive = (path: string) => 
        pathname === path 
            ? "text-black font-bold border-b-2 border-black" 
            : "text-gray-500 hover:text-black";

    return (
        <div className="border-b border-gray-200 sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center gap-8">
                        {/* El logo ahora redirige al Dashboard principal */}
                        <Link href="/admin" className="flex items-center gap-2">
                            <p className="font-serif font-bold text-2xl tracking-tight uppercase text-black">
                                Lumière
                            </p>
                            <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-sans font-bold">ADMIN</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6 mt-1">
                            {/* Nuevo enlace al Dashboard */}
                            <Link href="/admin" className={`text-sm py-5 transition-colors ${isActive("/admin")}`}>
                                📈 Tablero
                            </Link>
                            <Link href="/admin/orders" className={`text-sm py-5 transition-colors ${isActive("/admin/orders")}`}>
                                💰 Ventas
                            </Link>
                            <Link href="/admin/products" className={`text-sm py-5 transition-colors ${isActive("/admin/products")}`}>
                                📦 Productos
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/admin/profile" className={`text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block ${isActive("/admin/profile")}`}>
                            Mi Perfil
                        </Link>
                        
                        <span className="text-gray-300 hidden sm:block">|</span>

                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">
                            Ver tienda
                        </Link>
                        
                        <span className="text-gray-300 hidden sm:block">|</span>

                        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium transition-colors text-sm">
                            Cerrar Sesión
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}