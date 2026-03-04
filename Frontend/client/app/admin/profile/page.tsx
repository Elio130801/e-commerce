"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileData from "@/components/ProfileData";
import ProfileSecurity from "@/components/ProfileSecurity";

export default function AdminProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("datos");
    const [userName, setUserName] = useState("Cargando...");
    const [userEmail, setUserEmail] = useState("Cargando...");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // En el admin, buscamos el admin_token
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/login");
            return;
        }

        let userId = "";

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            userId = payload.sub;
            
            setUserEmail(payload.email);
            if (payload.fullName || payload.name) {
                setUserName(payload.fullName || payload.name);
            }
        } catch (e) {
            console.error("Error leyendo token:", e);
            router.push("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUserName(userData.fullName);
                    setUserEmail(userData.email);
                }
            } catch (error) {
                console.error("Error trayendo datos del usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const btnStyle = (tab: string) => `
        w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-3
        ${activeTab === tab 
            ? 'bg-black text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'}
    `;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Perfil de Administrador</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* SIDEBAR EXCLUSIVO DEL ADMIN */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center sticky top-24">
                            <div className="w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                                {userName !== "Cargando..." ? userName.charAt(0).toUpperCase() : "A"}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                            <p className="text-sm text-gray-500 mb-6">{userEmail}</p>

                            <div className="border-t border-gray-100 pt-6 space-y-2">
                                <button onClick={() => setActiveTab('datos')} className={btnStyle('datos')}>
                                    👤 Mis Datos
                                </button>
                                <button onClick={() => setActiveTab('seguridad')} className={btnStyle('seguridad')}>
                                    🔐 Seguridad
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FORMULARIOS RECICLADOS */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500">
                                Cargando información del perfil...
                            </div>
                        ) : (
                            <>
                                {activeTab === 'datos' && (
                                    <ProfileData userName={userName} userEmail={userEmail} />
                                )}
                                {activeTab === 'seguridad' && (
                                    <ProfileSecurity />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}