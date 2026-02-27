"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); 

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validaciones
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password); 
    const hasSpecial = /[\W_]/.test(password);
    const passwordsMatch = password === confirmPassword && password.length > 0; 
    
    const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

    if (!token) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl text-gray-600">Enlace inválido o expirado. Falta el token.</p></div>;
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:4000/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                alert("¡Contraseña actualizada con éxito! 🎉 Ahora puedes iniciar sesión.");
                router.push("/login"); 
            } else {
                const data = await response.json();
                setError(data.message || "Error al actualizar la contraseña.");
            }
        } catch (error) {
            setError("Error de conexión con el servidor.");
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
                    Crea una nueva contraseña
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleReset}>
                        
                        {/* 👇 Campo: Nueva Contraseña con Ojito */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <div className="mt-1 relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-black outline-none sm:text-sm" 
                                    placeholder="Mínimo 8 caracteres" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                                >
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
                            <div className="mt-3 text-xs space-y-1">
                                <p className={hasMinLength ? "text-green-600" : "text-gray-500"}>{hasMinLength ? "✓" : "○"} Mínimo 8 caracteres</p>
                                <p className={hasUpper ? "text-green-600" : "text-gray-500"}>{hasUpper ? "✓" : "○"} Una mayúscula</p>
                                <p className={hasLower ? "text-green-600" : "text-gray-500"}>{hasLower ? "✓" : "○"} Una minúscula</p>
                                <p className={hasNumber ? "text-green-600" : "text-gray-500"}>{hasNumber ? "✓" : "○"} Un número</p>
                                <p className={hasSpecial ? "text-green-600" : "text-gray-500"}>{hasSpecial ? "✓" : "○"} Un símbolo</p>
                            </div>
                        </div>

                        {/* 👇 Campo: Repetir Contraseña con Ojito */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Repetir Nueva Contraseña</label>
                            <div className="mt-1 relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    required 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-black outline-none sm:text-sm" 
                                    placeholder="Repite la contraseña" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                                >
                                    {showConfirmPassword ? (
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
                            <div className="mt-2 text-xs">
                                <p className={passwordsMatch ? "text-green-600" : "text-gray-500"}>{passwordsMatch ? "✓" : "○"} Coinciden</p>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

                        <button type="submit" disabled={isLoading || !isPasswordValid} className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition-colors">
                            {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}