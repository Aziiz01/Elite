import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { registerUser, loginUser } from '../api/client';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Connexion');
  const { token, setToken, navigate } = useContext(ShopContext)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const redirect = location.state?.redirect || searchParams.get('returnUrl') || '/'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [telephone, setTelephone] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const switchToSignUp = () => {
    setCurrentState('Inscription')
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
    setCurrentState('Connexion')
    setEmail('')
    setPassword('')
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        const apiCall = currentState === 'Inscription' 
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
      <Helmet>
        <title>{currentState === 'Connexion' ? 'Connexion' : 'Créer un compte'} | Elite</title>
        <meta name="description" content={currentState === 'Connexion' ? 'Connectez-vous à votre compte Elite pour gérer vos commandes, favoris et profil.' : 'Créez un compte Elite pour sauvegarder votre panier, suivre vos commandes et gérer votre profil.'} />
      </Helmet>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='font-semibold text-3xl tracking-tight'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Inscription' && (
          <>
            <div className='w-full flex gap-3 min-w-0'>
              <input onChange={(e)=>setFirstName(e.target.value)} value={firstName} type="text" className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Prénom' required/>
              <input onChange={(e)=>setLastName(e.target.value)} value={lastName} type="text" className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Nom' required/>
            </div>
            <input onChange={(e)=>setCity(e.target.value)} value={city} type="text" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Ville' required/>
            <input onChange={(e)=>setAddress(e.target.value)} value={address} type="text" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Adresse' required/>
            <input onChange={(e)=>setTelephone(e.target.value)} value={telephone} type="tel" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Téléphone (min. 8 chiffres)' required minLength={8}/>
            <input onChange={(e)=>setPostalCode(e.target.value)} value={postalCode} type="text" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Code postal (min. 3 caractères)' required minLength={3}/>
          </>
        )}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='E-mail' required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent' placeholder='Mot de passe (min. 8 caractères)' required minLength={8}/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer'>Mot de passe oublié ?</p>
            {
              currentState === 'Connexion' 
              ? <p onClick={switchToSignUp} className='cursor-pointer'>Créer un compte</p>
              : <p onClick={switchToLogin} className='cursor-pointer'>Déjà inscrit ?</p>
            }
        </div>
        <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4 rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'>{currentState === 'Connexion' ? 'Se connecter' : "S'inscrire"}</button>
    </form>
  )
}

export default Login
