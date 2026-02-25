import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types'; 

// 1. Creamos un nuevo tipo que hereda de Product pero le suma "quantity"
export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[]; // Ahora guarda CartItems
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
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
                    // Si ya existe, actualizamos su cantidad sumándole 1
                    set({
                        items: currentItems.map((item) => 
                            item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
                        )
                    });
                    alert("Agregaste otra unidad al carrito 🛒");
                } else {
                    // Si no existe, lo agregamos por primera vez con cantidad 1
                    set({ items: [...currentItems, { ...data, quantity: 1 }] });
                    alert("Producto agregado al carrito 🛍️");
                }
            },

            increaseQuantity: (id: string) => {
                set({
                    items: get().items.map((item) => 
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                });
            },

            decreaseQuantity: (id: string) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === id);

                // Si hay más de 1, restamos 1. Si es 1, no hace absolutamente nada.
                if (existingItem && existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((item) => 
                            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                        )
                    });
                }
            },

            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.id !== id)] });
            },

            removeAll: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;