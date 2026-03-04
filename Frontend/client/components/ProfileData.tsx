"use client";

import { useState } from "react";

interface ProfileDataProps {
    userName: string;
    userEmail: string;
}

export default function ProfileData({ userName, userEmail }: ProfileDataProps) {
    const [name, setName] = useState(userName);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
            if (!token) return;

            // Extraemos el ID del usuario desde el token
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;

            const response = await fetch(`http://localhost:4000/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ fullName: name }),
            });

            if (response.ok) {
                setMessage({ text: "¡Datos actualizados con éxito! (Verás el cambio en el menú al recargar)", type: "success" });
            } else {
                setMessage({ text: "Hubo un error al actualizar los datos.", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error de conexión con el servidor.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                👤 Mis Datos Personales
            </h2>
            
            <form className="space-y-6 max-w-lg" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white text-gray-900 transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input 
                        type="email" 
                        defaultValue={userEmail}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede cambiar por seguridad.</p>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <button 
                        type="submit"
                        disabled={isLoading || name === userName}
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}