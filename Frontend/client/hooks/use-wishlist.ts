import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types'; 

interface WishlistStore {
    items: Product[];
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    hasItem: (id: string) => boolean;
}

const useWishlist = create(
    persist<WishlistStore>(
        (set, get) => ({
            items: [],

            addItem: (data: Product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);
        
                if (!existingItem) {
                    set({ items: [...currentItems, data] });
                }
            },

            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.id !== id)] });
            },

            hasItem: (id: string) => {
                return get().items.some((item) => item.id === id);
            }
        }),
        {
            name: 'wishlist-storage', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useWishlist;