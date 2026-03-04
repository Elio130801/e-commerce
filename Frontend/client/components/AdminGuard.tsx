"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // 1. Buscamos la llave VIP del administrador
        const adminToken = localStorage.getItem("admin_token");

        // 2. Si no la tiene, lo mandamos al login inmediatamente
        if (!adminToken) {
            router.replace("/login"); 
        } else {
            // Si la tiene, le damos luz verde
            setIsAuthorized(true);
        }
    }, [router]);

    // 3. Mientras el Guardián verifica la llave (tarda milisegundos), 
    // no mostramos los hijos (el panel) para que el intruso no vea nada de información.
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium tracking-wide animate-pulse">
                    Verificando seguridad... 🔒
                </p>
            </div>
        );
    }

    // 4. Si está autorizado, mostramos el contenido protegido
    return <>{children}</>;
}