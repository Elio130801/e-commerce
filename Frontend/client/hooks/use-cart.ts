import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types'; 

export interface CartItem extends Product {
    quantity: number;
}

// 👇 1. Definimos la estructura matemática del cupón
export interface CouponData {
    code: string;
    discountPercentage: number;
}

interface CartStore {
    items: CartItem[];
    coupon: CouponData | null; // 👇 Nuevo estado para el cupón activo
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeAll: () => void;
    applyCoupon: (coupon: CouponData) => void; // 👇 Nueva acción
    removeCoupon: () => void; // 👇 Nueva acción
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],
            coupon: null, // Arranca sin descuentos

            addItem: (data: Product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);
        
                if (existingItem) {
                    set({
                        items: currentItems.map((item) => 
                            item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
                        )
                    });
                    alert("Agregaste otra unidad al carrito 🛒");
                } else {
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

            // 👇 Al vaciar el carrito (por ejemplo en el success), limpiamos el cupón también
            removeAll: () => set({ items: [], coupon: null }),

            // 👇 Controladores del cupón
            applyCoupon: (coupon: CouponData) => set({ coupon }),
            removeCoupon: () => set({ coupon: null }),
        }),
        {
            name: 'cart-storage', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;