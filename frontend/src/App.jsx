import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import OrderStatus from './pages/OrderStatus'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import PromoStrip from './components/PromoStrip'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import BackToTop from './components/BackToTop'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <PromoStrip />
      <header className='sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200'>
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Navbar />
        </div>
      </header>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <SearchBar />
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/order-status/:orderId?' element={<OrderStatus />} />
        <Route path='/orders' element={<Navigate to='/profile?section=orders' replace />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </div>
  )
}

export default App
