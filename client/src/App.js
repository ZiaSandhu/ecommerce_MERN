import React from 'react';
import './App.css';
import Navbar from './features/navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home, LoginPage, SignUpPage, CartPage, CheckOut, ProductDetailPage} from './pages'
function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      //for now later i will change
      <Route path='/products' element={<Home />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignUpPage />}/>
      <Route path='/cart' element={<CartPage />}/>
      <Route path='/checkout' element={<CheckOut /> }/>
      <Route path='/product/:id' element={<ProductDetailPage /> }/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
