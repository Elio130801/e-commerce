"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:4000/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setMessage(data.message);

            // 🚨 SIMULACIÓN DE CORREO: Como no enviamos un correo real, redirigimos automáticamente 
            // al link que generó el backend para que puedas probar el flujo.
            if (data.simulateEmailLink) {
                setTimeout(() => {
                    alert("¡Simulando que abriste el enlace desde tu correo! 📧");
                    router.push(data.simulateEmailLink.replace("http://localhost:3000", ""));
                }, 2000);
            }
        } catch (error) {
            setMessage("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="font-serif text-3xl tracking-wider text-black">LUMIÈRE</span>
                </Link>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Recuperar Contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo y te enviaremos las instrucciones.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleForgot}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm outline-none" placeholder="tu@correo.com" />
                        </div>

                        {message && (
                            <div className="text-blue-600 text-sm font-medium bg-blue-50 p-3 rounded-md text-center">
                                {message}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition-colors">
                            {isLoading ? "Enviando..." : "Enviar enlace"}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}