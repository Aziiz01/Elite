import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const location = useLocation()

  if (!showSearch || !location.pathname.includes('collection')) return null

  return (
    <div className='border-b border-[#e5e5e5] bg-[#f8f8f8] mb-6'>
      <div className='flex items-center gap-3 px-4 py-3'>
        <svg className='w-4 h-4 text-[#aaa] flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z' />
        </svg>
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 bg-transparent text-[13px] text-[#111] placeholder:text-[#aaa] focus:outline-none'
          type='text'
          placeholder='Rechercher un produit…'
        />
        <button
          type='button'
          onClick={() => { setShowSearch(false); setSearch('') }}
          className='text-[#bbb] hover:text-[#111] transition-colors cursor-pointer text-[11px] uppercase tracking-[0.1em]'
          aria-label='Fermer'
        >
          Fermer
        </button>
      </div>
    </div>
  )
}

export default SearchBar
