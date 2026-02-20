"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname(); // Para saber en qué página estamos y pintar el botón activo

    const handleLogout = () => {
        // Borramos la llave VIP
        localStorage.removeItem("admin_token");
        alert("Sesión cerrada correctamente");
        router.push("/admin/login");
    };

    // Función para darle estilo al enlace activo
    const isActive = (path: string) => pathname === path ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <nav className="bg-black text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo / Título */}
                    <div className="shrink-0">
                        <span className="font-serif text-xl tracking-wider">LUMIÈRE ADMIN</span>
                    </div>

                    {/* Enlaces de navegación */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/admin/orders" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/admin/orders")}`}>
                                📊 Ventas
                            </Link>
                            <Link href="/admin/products" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/admin/products")}`}>
                                📦 Productos
                            </Link>
                        </div>
                    </div>

                    {/* Botón de Cerrar Sesión */}
                    <div>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}