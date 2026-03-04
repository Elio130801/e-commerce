"use client";

import { useState } from "react";

export default function ProfileSecurity() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Estados de visibilidad de contraseñas
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Estados de la petición
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Validaciones
    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword); 
    const hasSpecial = /[\W_]/.test(newPassword);
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0; 
    
    const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

    const handleUpdatePassword = async () => {
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
            if (!token) return;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;

            const response = await fetch(`http://localhost:4000/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword }),
            });

            if (response.ok) {
                setMessage({ text: "¡Contraseña actualizada con éxito! 🔐", type: "success" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ text: "Hubo un error al actualizar la contraseña.", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error de conexión con el servidor.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // Ícono del ojito corregido (sin el mt-6)
    const EyeIcon = ({ show, toggle }: { show: boolean, toggle: () => void }) => (
        <button type="button" onClick={toggle} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors">
            {show ? (
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
    );

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🔐 Seguridad
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Actualiza tu contraseña para mantener tu cuenta segura.</p>
            
            <form className="space-y-6 max-w-lg" onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
                
                {/* 1. Contraseña Actual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                    {/* 👇 El div relative abraza SOLAMENTE al input y al ícono */}
                    <div className="relative">
                        <input 
                            type={showCurrent ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none pr-10"
                        />
                        <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
                    </div>
                </div>
                
                {/* 2. Nueva Contraseña */}
                <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                    {/* 👇 El div relative abraza SOLAMENTE al input y al ícono */}
                    <div className="relative">
                        <input 
                            type={showNew ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none pr-10"
                        />
                        <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
                    </div>
                    
                    {/* Las validaciones quedan afuera del relative */}
                    <div className="mt-3 text-xs space-y-1">
                        <p className={hasMinLength ? "text-green-600 font-medium" : "text-gray-500"}>{hasMinLength ? "✓" : "○"} Mínimo 8 caracteres</p>
                        <p className={hasUpper ? "text-green-600 font-medium" : "text-gray-500"}>{hasUpper ? "✓" : "○"} Una letra mayúscula</p>
                        <p className={hasLower ? "text-green-600 font-medium" : "text-gray-500"}>{hasLower ? "✓" : "○"} Una letra minúscula</p>
                        <p className={hasNumber ? "text-green-600 font-medium" : "text-gray-500"}>{hasNumber ? "✓" : "○"} Un número</p>
                        <p className={hasSpecial ? "text-green-600 font-medium" : "text-gray-500"}>{hasSpecial ? "✓" : "○"} Un carácter especial</p>
                    </div>
                </div>

                {/* 3. Confirmar Contraseña */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                    {/* 👇 El div relative abraza SOLAMENTE al input y al ícono */}
                    <div className="relative">
                        <input 
                            type={showConfirm ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none pr-10"
                        />
                        <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                    </div>
                    <div className="mt-2 text-xs">
                        <p className={passwordsMatch ? "text-green-600 font-medium" : "text-gray-500"}>
                            {passwordsMatch ? "✓" : "○"} Las contraseñas coinciden
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <button 
                        type="submit"
                        disabled={isLoading || !isPasswordValid || !currentPassword}
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                    </button>
                </div>
            </form>
        </div>
    );
}