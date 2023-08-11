import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    products: [],
    totalProducts: 0,
    categories: [],
    brands: [],
    productDetail: {},
    allProducts: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            const { products, totalProducts } = action.payload
            state.products = products
            state.totalProducts = totalProducts
        },
        setCategory: (state, action) => {
            let categories = state.allProducts.map((prod) => prod.category)
            categories = [...new Set([...categories])]

            state.categories = categories.map((item) => {
                return {
                    value: item,
                    label: item.split('-').join(' ').toUpperCase()
                }
            })
        },
        setBrand: (state, action) => {
            if (!action.payload) {
                let brand = state.allProducts.map((prod) => prod.brand)
                brand = [...new Set([...brand])]

                state.brands = brand.map((item) => {
                    return {
                        value: item,
                        label: item.toUpperCase()
                    }
                })
            }
            else {
                let brand = state.allProducts
                    .filter((prod) => action.payload.includes(prod.category)) 
                    .map((prod) => prod.brand);
                brand = [...new Set([...brand])]
                console.log("🚀 ~ file: productSlice.js:50 ~ brand:", brand)

                state.brands = brand.map((item) => {
                    return {
                        value: item,
                        label: item.toUpperCase()
                    }
                })
            }
        },
        setProductDetail: (state, action) => {
            state.productDetail = action.payload
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        }

    }
})

export const { setProducts: setProducts, setCategory, setBrand, setProductDetail, setAllProducts } = productSlice.actions

export default productSlice.reducer