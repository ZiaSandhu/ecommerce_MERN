import React from 'react';
import './App.css';
import Navbar from './features/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, LoginPage, SignUpPage, CartPage, CheckOut, ProductDetailPage, ErrorPage } from './pages'
import Protected from './features/auth/Protected'
import Signout from './features/auth/Signout';
import OrderPage from './features/order/OrderPage';
import OrderSummary from './features/order/OrderSummary';
import OrderList from './features/order/OrderList';
import UserProfile from './features/user/UserProfile'
import AdminProtected from './features/admin/AdminProtected';
import AdminProduct from './features/admin/AdminProduct'
import AdminOrderList from './features/admin/AdminOrder';
import Products from './features/product/Products';
import AdminProductForm from './features/admin/AdminProductForm';
import Footer from './features/footer/Footer';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<Protected><CheckOut /></Protected>} />
        <Route path='/order/success' element={<Protected><OrderPage /></Protected>} />
        <Route path='/user/orderSummary' element={<Protected><OrderSummary /></Protected>} />
        <Route path='/user/profile' element={<Protected><UserProfile /></Protected>} />
        <Route path='/orders' element={<Protected><OrderList /></Protected>} />
        <Route path='/signout' element={<Protected><Signout /></Protected>} />
        <Route path='/product/:id' element={<ProductDetailPage />} />
        <Route path='/admin/products' element={<Protected> <AdminProtected ><AdminProduct /> </AdminProtected> </Protected>} />
        <Route path='/admin/orders' element={<Protected> <AdminProtected ><AdminOrderList /> </AdminProtected> </Protected>} />
        <Route path='/admin/productform' element={<Protected> <AdminProtected ><AdminProductForm /> </AdminProtected> </Protected>} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
