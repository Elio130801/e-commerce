"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                            {/* Label y Olvidaste tu contraseña */}
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-gray-500 hover:text-black hover:underline transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>
                            
                            {/* 👇 AQUÍ ESTÁ EL ARREGLO: Este div relative envuelve al input y al botón */}
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                                >
                                    {/* Iconos SVG profesionales de Heroicons */}
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>
                        </div>
            
                    </form>
                </div>
            </div>
        </div>
    );
}