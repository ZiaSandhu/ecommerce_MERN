import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    products: [],
    totalProducts: 0,
    categories: [],
    brands: [],
    productDetail: {},
    allCategoryBrands: []
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
        
        filterBrands: (state, action) => {
                let brand = state.allCategoryBrands.filter((item) => action.payload.includes(item.cat)).map(item => item.brand) 
                brand = [...new Set([...brand])]
                state.brands = brand.map((item) => {
                    return {
                        value: item,
                        label: item.toUpperCase()
                    }
                })
        },
        setProductDetail: (state, action) => {
            state.productDetail = action.payload
        },
        setAllCategoryBrands: (state, action) => {
            let data = action.payload
            data = data.map(item => {
                let cat = item.category
                let brand = item.brand
                return {
                    cat,brand
                }
            })
            const uniqueSet = new Set(data.map(JSON.stringify));
             state.allCategoryBrands = Array.from(uniqueSet).map(JSON.parse);

            let categories = state.allCategoryBrands.map((prod) => prod.cat)
            categories = [...new Set([...categories])]
            state.categories = categories.map((item) => {
                return {
                    value: item,
                    label: item.split('-').join(' ').toUpperCase()
                }
            })
            let brands = state.allCategoryBrands.map((prod) => prod.brand)
            brands = [...new Set([...brands])]

            state.brands = brands.map((item) => {
                return {
                    value: item,
                    label: item.split('-').join(' ').toUpperCase()
                }
            })
            
        }

    }
})

export const {  setProducts,  filterBrands, setProductDetail, setAllCategoryBrands } = productSlice.actions

export default productSlice.reducer