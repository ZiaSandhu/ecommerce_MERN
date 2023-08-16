const router = require('express').Router()
const {upload} = require('../middleware/fileUpdoad')
const {register, login, logout} = require('../controllers/authController')
const {showAllProducts, showProductById, createProduct, updateProduct, deleteManyProduct, deleteProductById, getAllProducts} = require('../controllers/productContorller')
const { getOrder, getOrderById, createOrder, getUserOrder } = require('../controllers/orderController')
const { udpateCart, getCarts, getUserCart } = require('../controllers/cartController')
const { getAllUsers,updateUser } = require('../controllers/userController')
const { auth } = require('../middleware/auth')


router.get('/',()=>{
    console.log('Local host 5000')
})
// authentication
router.post('/register',register)
router.post('/login',login)
router.post('/logout',auth,logout)

// customers
router.get('/users',auth,getAllUsers)
router.patch('/updateuser',auth,updateUser)

// products
router.get('/getProducts',getAllProducts)
router.get('/products',showAllProducts)
router.get('/product/:_id',showProductById)
router.post('/product/add',auth, upload.array('productImages') ,createProduct)
router.put('/product/update/:id',auth,upload.array('productImages'),updateProduct)
router.delete('/product/delete/:id',auth,deleteProductById)
router.delete('/products/delete',auth,deleteManyProduct)

// orders
router.post('/ordercreate',auth,createOrder)
router.get('/order/:id',auth,getOrderById)
router.get('/order/user/:id',auth,getUserOrder)
router.get('/orders',auth,getOrder)

//carts
router.get('/carts',auth,getCarts)
router.post('/updateCart',auth,udpateCart)
router.get('/cart/:userId',auth,getUserCart)




module.exports = router