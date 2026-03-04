"use client";

import AdminNavbar from "@/components/AdminNavbar";
import AdminGuard from "@/components/AdminGuard"; // 👈 Importamos tu nuevo Guardián
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Verificamos si estamos en la pantalla de Login
    const isLoginPage = pathname === "/admin/login" || pathname === "/login";

    // 1. Si es la página de Login, NO ponemos el Guardián ni el Navbar. 
    // Solo mostramos el formulario de acceso.
    if (isLoginPage) {
        return <section>{children}</section>;
    }

    // 2. Si es cualquier otra página del panel (Orders, Products, etc.), 
    // activamos la bóveda de seguridad y mostramos el Navbar.
    return (
        <section>
            <AdminGuard>
                <AdminNavbar />
                {children}
            </AdminGuard>
        </section>
    );
}