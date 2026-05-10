import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  bookId: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const savedCart = localStorage.getItem("cart");

const initialState: CartState = {
  items: savedCart ? JSON.parse(savedCart) : [],
};

export const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    incrementCart: (state, action: PayloadAction<CartItem>) => {
      const existingBook = state.items.find(
        (item) => item.bookId === action.payload.bookId,
      );

      if (existingBook) {
        existingBook.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    decrementCart: (state, action: PayloadAction<number>) => {
      const existingBook = state.items.find(
        (item) => item.bookId === action.payload,
      );

      if (existingBook) {
        if (existingBook.quantity > 1) {
          existingBook.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.bookId !== action.payload,
          );
        }

        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];

      localStorage.removeItem("cart");
    },
  },
});

export const { incrementCart, decrementCart , clearCart } = cartSlice.actions;

export default cartSlice.reducer;
