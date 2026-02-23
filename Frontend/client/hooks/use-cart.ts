import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types'; // Asegúrate de que importe tu interfaz Product

interface CartStore {
    items: Product[];
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],

            addItem: (data: Product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);
        
                if (existingItem) {
                    return alert("¡Este producto ya está en el carrito!");
                }

                set({ items: [...get().items, data] });
                alert("Producto agregado al carrito 🛍️");
            },

            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.id !== id)] });
            },

            removeAll: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage', // Nombre de la clave en LocalStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;