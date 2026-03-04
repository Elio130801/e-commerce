"use client";

interface ProfileSidebarProps {
    userName: string;
    userEmail: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({ userName, userEmail, activeTab, setActiveTab }: ProfileSidebarProps) {
    const btnStyle = (tab: string) => `
        w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-3
        ${activeTab === tab 
            ? 'bg-black text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'}
    `;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center sticky top-24">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                {userName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
            <p className="text-sm text-gray-500 mb-6">{userEmail}</p>

            <div className="border-t border-gray-100 pt-6 space-y-2">
                <button onClick={() => setActiveTab('pedidos')} className={btnStyle('pedidos')}>
                    🛍️ Mis Pedidos
                </button>
                <button onClick={() => setActiveTab('datos')} className={btnStyle('datos')}>
                    👤 Mis Datos
                </button>
                <button onClick={() => setActiveTab('seguridad')} className={btnStyle('seguridad')}>
                    🔐 Seguridad
                </button>
            </div>
        </div>
    );
}