import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center py-16 px-6 text-center'>
      <Helmet>
        <title>Page introuvable | Elite</title>
      </Helmet>
      <p className='text-6xl sm:text-8xl font-light text-gray-300 mb-4'>404</p>
      <h1 className='text-xl sm:text-2xl font-medium text-gray-800 mb-2'>Page introuvable</h1>
      <p className='text-gray-600 mb-8 max-w-md'>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className='flex flex-wrap gap-4 justify-center'>
        <Link
          to='/'
          className='inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors'
        >
          Retour à l'accueil
        </Link>
        <Link
          to='/collection'
          className='inline-block px-6 py-3 border border-gray-800 text-gray-800 text-sm font-medium hover:bg-gray-100 transition-colors'
        >
          Découvrir la collection
        </Link>
      </div>
    </div>
  )
}

export default NotFound
