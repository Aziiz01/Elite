import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Edit from './pages/Edit'
import Users from './pages/Users'
import Categories from './pages/Categories'
import Newsletter from './pages/Newsletter'
import HeroSection from './pages/HeroSection'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PROD_BACKEND = 'https://elite-backend-two.vercel.app';
const DEV_BACKEND = 'http://localhost:4000';
const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();
export const backendUrl = import.meta.env.PROD
  ? (envUrl && !envUrl.includes('localhost') ? envUrl : PROD_BACKEND)
  : (envUrl || DEV_BACKEND);
export const currency = ' Dt'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'efef');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/edit/:id' element={<Edit token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/users' element={<Users token={token} />} />
                <Route path='/categories' element={<Categories token={token} />} />
                <Route path='/newsletter' element={<Newsletter token={token} />} />
                <Route path='/hero' element={<HeroSection token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App