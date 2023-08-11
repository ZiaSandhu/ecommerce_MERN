import { createSlice } from "@reduxjs/toolkit";
function getCart() {
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    if (!Array.isArray(cart)) return []
    return cart
}
const initialState = {
    cart: getCart(),
    subTotal: 0,
    totalAmount: 0,
    shippingFee: 500,
    totalItem: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            let exist = state.cart.findIndex(item => item.itemId === action.payload.itemId)
            if (exist >= 0) {
                let product = state.cart[exist]
                let qty = action.payload.qty + product.qty
                product.qty = qty >= product.stock ? product.stock : qty
                state.cart[exist] = product
            }
            else {
                state.cart = [...state.cart, action.payload]
            }
        },
        removeItem: (state, action) => {
            let qty
            state.cart.forEach((item) => {
                if (item['itemId'] === action.payload) {
                    qty = item.qty
                }
            })
            state.totalItem = state.totalItem - qty
            let newCart = state.cart.filter((item) => item.itemId !== action.payload)
            state.cart = newCart
        },
        increaseQty: (state, action) => {
            let newCart = state.cart.map((item) => {
                return item.itemId === action.payload ? { ...item, qty: item['qty'] + 1 } : item
            })
            state.cart = newCart
        },
        decreaseQty: (state, action) => {
            let newCart = state.cart.map((item) => {
                return item.itemId === action.payload ? { ...item, qty: item['qty'] - 1 } : item
            })
            state.cart = newCart
        },
        updateTotal: (state, action) => {
            const cart = state.cart;

            if (cart.length === 0) {
                state.subTotal = 0;
                state.totalItem = 0;
            } else {
                const subTotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
                const totalItem = cart.reduce((acc, item) => acc + item.qty, 0);

                state.subTotal = subTotal;
                state.totalItem = totalItem;
            }

            state.totalAmount = state.subTotal + state.shippingFee;

    },
    localStorageCart: (state, action) => {
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    resetCart: (state, action) => {
        localStorage.removeItem('cart')
        return initialState
    }
}
})

export const { addToCart, removeItem, increaseQty, decreaseQty, updateTotal, localStorageCart, resetCart } = cartSlice.actions
export default cartSlice.reducer