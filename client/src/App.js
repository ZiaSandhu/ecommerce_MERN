import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductList from './features/product/ProductList'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignUpPage />}/>
      {/* <Route path='/' element={<Home />}/> */}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
