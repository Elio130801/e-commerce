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

    // Actualizamos la función para que el enlace activo sea minimalista (negrita y negro) 
    // y el inactivo sea gris sutil.
    const isActive = (path: string) => 
        pathname === path 
            ? "text-black font-bold" 
            : "text-gray-500 hover:text-black";

    return (
        <div className="border-b border-gray-200 sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* 1. LOGO Y NAVEGACIÓN */}
                    <div className="flex items-center gap-8">
                        {/* Logo idéntico al del cliente pero con la etiqueta ADMIN */}
                        <Link href="/admin/products" className="flex items-center gap-2">
                            <p className="font-serif font-bold text-2xl tracking-tight uppercase text-black">
                                Lumière
                            </p>
                        </Link>

                        {/* Enlaces de navegación */}
                        <div className="hidden md:flex items-center space-x-6 mt-1">
                            <Link href="/admin/orders" className={`text-sm transition-colors ${isActive("/admin/orders")}`}>
                                📊 Ventas
                            </Link>
                            <Link href="/admin/products" className={`text-sm transition-colors ${isActive("/admin/products")}`}>
                                📦 Productos
                            </Link>
                        </div>
                    </div>

                    {/* 2. ACCIONES */}
                    <div className="flex items-center gap-5">
                        {/* Botón para volver rápido a ver cómo quedó la tienda */}
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">
                            Ver tienda
                        </Link>
                        
                        <span className="text-gray-300 hidden sm:block">|</span>

                        {/* Botón de cerrar sesión minimalista e idéntico al estilo del cliente */}
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:underline transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}