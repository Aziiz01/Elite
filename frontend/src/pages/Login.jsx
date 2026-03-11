import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { registerUser, loginUser } from '../api/client';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate } = useContext(ShopContext)
  const location = useLocation()
  const redirect = location.state?.redirect || '/'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [telephone, setTelephone] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const switchToSignUp = () => {
    setCurrentState('Sign Up')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setCity('')
    setAddress('')
    setTelephone('')
    setPostalCode('')
  }

  const switchToLogin = () => {
    setCurrentState('Login')
    setEmail('')
    setPassword('')
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        const apiCall = currentState === 'Sign Up' 
          ? () => registerUser({ firstName, lastName, email, password, city, address, telephone, postalCode })
          : () => loginUser({ email, password });
        
        const response = await apiCall();
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
  }

  useEffect(()=>{
    if (token) {
      navigate(redirect, { replace: true })
    }
  },[token, navigate, redirect])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='font-semibold text-3xl tracking-tight'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Sign Up' && (
          <>
            <div className='w-full flex gap-3 min-w-0'>
              <input onChange={(e)=>setFirstName(e.target.value)} value={firstName} type="text" className='flex-1 min-w-0 px-3 py-2 border border-gray-800' placeholder='First name' required/>
              <input onChange={(e)=>setLastName(e.target.value)} value={lastName} type="text" className='flex-1 min-w-0 px-3 py-2 border border-gray-800' placeholder='Last name' required/>
            </div>
            <input onChange={(e)=>setCity(e.target.value)} value={city} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='City' required/>
            <input onChange={(e)=>setAddress(e.target.value)} value={address} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Address' required/>
            <input onChange={(e)=>setTelephone(e.target.value)} value={telephone} type="tel" className='w-full px-3 py-2 border border-gray-800' placeholder='Telephone (min 8 digits)' required minLength={8}/>
            <input onChange={(e)=>setPostalCode(e.target.value)} value={postalCode} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Postal code (min 3 chars)' required minLength={3}/>
          </>
        )}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password (min 8 characters)' required minLength={8}/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer'>Forgot your password?</p>
            {
              currentState === 'Login' 
              ? <p onClick={switchToSignUp} className='cursor-pointer'>Create account</p>
              : <p onClick={switchToLogin} className='cursor-pointer'>Login Here</p>
            }
        </div>
        <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
