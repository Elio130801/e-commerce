"use client";

import AdminNavbar from "@/components/AdminNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // No queremos mostrar el Navbar de admin en la pantalla de Login
    const isLoginPage = pathname === "/admin/login";

    return (
        <section>
            {!isLoginPage && <AdminNavbar />}
            {children}
        </section>
    );
}