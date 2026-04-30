import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION (PORTADA ÉPICA) */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Fondo: Aquí puedes poner una imagen real de tu carpeta public usando <img> o un color premium */}
        <div className="absolute inset-0 bg-black">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-50"
            >
              <source src="https://www.pexels.com/es-es/download/video/7815734/" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
        </div>
        {/* Contenido sobre el fondo */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="block text-white/80 uppercase tracking-[0.3em] text-sm mb-4 font-medium">Nueva Colección 2026</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Descubre Tu <br/> Esencia
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-xl mx-auto">
            Fragancias exclusivas y cuidado de la piel diseñado para resaltar tu belleza natural.
          </p>
          <Link 
            href="/shop" 
            className="inline-block bg-white text-black px-10 py-4 font-bold uppercase tracking-wider text-sm hover:bg-gray-100 transition-colors"
          >
            Ver Colección Completa
          </Link>
        </div>
      </section>

      {/* 2. BANDA DE BENEFICIOS (TRUST INDICATORS) */}
      <section className="border-b border-gray-200 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <span className="text-2xl mb-2">📦</span>
              <h3 className="font-bold text-gray-900 mb-1">Envío Gratis</h3>
              <p className="text-sm text-gray-500">En todas las órdenes superiores a $50</p>
            </div>
            
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <span className="text-2xl mb-2">✨</span>
              <h3 className="font-bold text-gray-900 mb-1">100% Originales</h3>
              <p className="text-sm text-gray-500">Garantía de autenticidad en cada producto</p>
            </div>
            
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <span className="text-2xl mb-2">💳</span>
              <h3 className="font-bold text-gray-900 mb-1">Pago Seguro</h3>
              <p className="text-sm text-gray-500">Transacciones protegidas con Mercado Pago</p>
            </div>

          </div>
        </div>
      </section>

      {/* AQUÍ IRÁN LUEGO LAS CATEGORÍAS Y LOS MÁS VENDIDOS */}
      
    </main>
  );
}