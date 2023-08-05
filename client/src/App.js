import React from 'react';
import './App.css';
import Navbar from './features/navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home, LoginPage, SignUpPage, CartPage, CheckOut, ProductDetailPage} from './pages'
import Protected from './features/auth/Protected'
import Signout from './features/auth/Signout';
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
      <Route path='/cart' element={<Protected><CartPage /></Protected>}/>
      <Route path='/checkout' element={<Protected><CheckOut /></Protected> }/>
      <Route path='/signout' element={<Protected><Signout /></Protected> }/>
      <Route path='/product/:id' element={<ProductDetailPage /> }/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
