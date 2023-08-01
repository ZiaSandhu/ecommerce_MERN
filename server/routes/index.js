const router = require('express').Router()
const {upload} = require('../middleware/fileUpdoad')
const {register, login, logout, changePassword} = require('../controllers/authController')
const {showAllProducts, showProductById, createProduct, updateProduct, deleteManyProduct, deleteProductById, testingProduct} = require('../controllers/productContorller')
const { getOrder, getOrderById } = require('../controllers/orderController')
const { udpateCart, getCarts, getUserCart } = require('../controllers/cartController')
const { getAllUsers } = require('../controllers/userController')
const { auth } = require('../middleware/auth')


router.get('/',()=>{
    console.log('Local host 5000')
})
// authentication
router.post('/register',register)
router.post('/login',login)
router.post('/logout',auth,logout)
router.post('changePassword',auth,changePassword)

// customers
router.get('/users',auth,getAllUsers)

// products
router.get('/products',auth,showAllProducts)
router.get('/product/:id',auth,showProductById)
router.post('/product/add',auth, upload.array('productImages') ,createProduct)
router.put('/product/update/:id',auth,upload.array('productImages'),updateProduct)
router.delete('/product/delete/:id',auth,deleteProductById)
router.delete('/products/delete',auth,deleteManyProduct)

router.get('/orders',auth,getOrder)
router.get('/order/:id',auth,getOrderById)

//carts
router.get('/carts',auth,getCarts)
router.post('/updateCart',auth,udpateCart)
router.get('/cart/:userId',auth,getUserCart)



router.put('/test/:id',auth,upload.array('productImages'),testingProduct)

module.exports = router