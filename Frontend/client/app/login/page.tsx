"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const userRoles = data.user.roles || []; // Extraemos los roles del usuario
        
                // 👑 LÓGICA DE RUTEO POR ROL (El cerebro de la operación)
                if (userRoles.includes("admin")) {
                    // Si es el dueño, le damos la llave VIP y lo mandamos al panel
                    localStorage.setItem("admin_token", data.access_token);
                    alert("¡Bienvenido al Panel de Control, Jefe! 👑");
                    window.location.href = "/admin/products"; 
                } else {
                    // Si es un cliente, le damos la llave normal y lo mandamos a comprar
                    localStorage.setItem("token", data.access_token);
                    alert("¡Bienvenido de vuelta a Lumière! ✨");
                    window.location.href = "/"; 
                }

            } else {
                setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error(error);
            setError("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="font-serif text-3xl tracking-wider text-black hover:text-gray-700 transition-colors">
                        LUMIÈRE
                    </span>
                </Link>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Iniciar Sesión
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="font-medium text-black hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleLogin}>
            
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                    placeholder="tu@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Iniciando sesión..." : "Entrar"}
                            </button>
                        </div>
            
                    </form>
                </div>
            </div>
        </div>
    );
}