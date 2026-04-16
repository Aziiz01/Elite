/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getCategories } from '../api/client'

const FALLBACK_CATS = ['Lèvres', 'Teint', 'Yeux', 'Ongles', 'Soins', 'Parfums']

const SearchIcon = () => (
  <svg className='w-[18px] h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z' />
  </svg>
)
const UserIcon = () => (
  <svg className='w-[18px] h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' />
  </svg>
)
const HeartIcon = () => (
  <svg className='w-[18px] h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
  </svg>
)
const CartIconSvg = () => (
  <svg className='w-[18px] h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' />
  </svg>
)
const CloseIcon = () => (
  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
  </svg>
)
const MenuIcon = () => (
  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
  </svg>
)

const Navbar = () => {
  const { setShowSearch, setSearch, getCartCount, navigate, token, setToken, setCartItems, cartPulse } = useContext(ShopContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const searchInputRef = useRef(null)

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
          setCategories(res.data.categories)
        } else {
          setCategories(FALLBACK_CATS.map((name) => ({ name })))
        }
      })
      .catch(() => setCategories(FALLBACK_CATS.map((name) => ({ name }))))
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('guestCart')
    setToken('')
    setCartItems({})
    setProfileOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearch(searchQuery.trim())
      setShowSearch(true)
      navigate('/collection')
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const cartCount = getCartCount()

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className='hidden lg:block'>
        {/* Row 1: Search | Logo | Account icons */}
        <div className='flex items-center justify-between h-16 border-b border-[#F5F5F5]'>
          {/* Left: search */}
          <button
            type='button'
            onClick={() => setSearchOpen(true)}
            className='flex items-center gap-2 text-[#57534E] transition-colors hover:text-[#1C1917] cursor-pointer'
            aria-label='Rechercher'
          >
            <SearchIcon />
            <span className='text-[12px]'>Rechercher…</span>
          </button>

          {/* Center: logo */}
          <Link to='/' className='absolute left-1/2 -translate-x-1/2'>
            <img src={assets.logo} className='h-8 w-auto' alt='Elite' />
          </Link>

          {/* Right: icons */}
          <div className='flex items-center gap-5'>
            {/* Account */}
            <div className='relative'>
              <button
                type='button'
                onClick={() => token ? setProfileOpen((o) => !o) : navigate('/login')}
                className='text-[#57534E] transition-colors hover:text-[#1C1917] cursor-pointer'
                aria-label='Mon compte'
                aria-expanded={profileOpen}
              >
                <UserIcon />
              </button>
              {token && profileOpen && (
                <>
                  <div className='fixed inset-0 z-40' onClick={() => setProfileOpen(false)} aria-hidden='true' />
                  <div className='absolute right-0 top-full mt-3 z-50 animate-slide-down'>
                    <div className='w-44 bg-white border border-[#E5E5E5] shadow-lg py-2'>
                      {[
                        { label: 'Mon profil', path: '/profile' },
                        { label: 'Mes commandes', path: '/profile?section=orders' },
                        { label: 'Mes favoris', path: '/profile?section=favorites' },
                      ].map(({ label, path }) => (
                        <button
                          key={label}
                          type='button'
                          onClick={() => { setProfileOpen(false); navigate(path) }}
                          className='w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAFAF9] transition-colors cursor-pointer'
                        >
                          {label}
                        </button>
                      ))}
                      <div className='border-t border-[#E5E5E5] my-1' />
                      <button
                        type='button'
                        onClick={logout}
                        className='w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#FAFAF9] transition-colors cursor-pointer'
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to='/profile?section=favorites'
              className='text-[#57534E] transition-colors hover:text-[#1C1917]'
              aria-label='Mes favoris'
            >
              <HeartIcon />
            </Link>

            {/* Cart */}
            <Link
              to='/cart'
              className='relative text-[#57534E] transition-colors hover:text-[#1C1917]'
              aria-label={`Panier, ${cartCount} article(s)`}
            >
              <CartIconSvg />
              {cartCount > 0 && (
                <span
                  className={`absolute -right-2 -top-2 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#1C1917] text-[9px] font-bold text-white ${
                    cartPulse ? 'cart-badge-pulse' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Row 2: Category strip */}
        <nav
          className='flex items-center justify-center gap-7 h-11 overflow-x-auto'
          aria-label='Catégories'
          style={{ scrollbarWidth: 'none' }}
        >
          <NavLink
            to='/collection'
            end
            className={({ isActive }) =>
              `whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${
                isActive ? 'text-[#1C1917] border-b border-[#1C1917] pb-0.5' : 'text-[#57534E] hover:text-[#1C1917]'
              }`
            }
          >
            Tout
          </NavLink>
          {categories.slice(0, 8).map((cat) => (
            <NavLink
              key={cat._id ?? cat.name}
              to={`/collection?category=${encodeURIComponent(cat.name)}`}
              className={({ isActive }) =>
                `whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${
                  isActive ? 'text-[#1C1917] border-b border-[#1C1917] pb-0.5' : 'text-[#57534E] hover:text-[#1C1917]'
                }`
              }
            >
              {cat.name}
            </NavLink>
          ))}
          <NavLink
            to='/collection?deal=1'
            className={({ isActive }) =>
              `whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 ${
                isActive ? 'text-[#e02020]' : 'text-[#e02020] hover:text-[#b01818]'
              }`
            }
          >
            Promo
          </NavLink>
        </nav>
      </div>

      {/* ── MOBILE / TABLET ── */}
      <div className='flex lg:hidden items-center justify-between h-14'>
        <Link to='/' className='flex-shrink-0'>
          <img src={assets.logo} className='h-7 w-auto' alt='Elite' />
        </Link>
        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={() => setSearchOpen(true)}
            className='text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer'
            aria-label='Rechercher'
          >
            <SearchIcon />
          </button>
          <Link
            to='/cart'
            className='relative text-[#57534E] hover:text-[#1C1917] transition-colors'
            aria-label={`Panier, ${cartCount} article(s)`}
          >
            <CartIconSvg />
            {cartCount > 0 && (
              <span
                className={`absolute -right-2 -top-2 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#1C1917] text-[9px] font-bold text-white ${
                  cartPulse ? 'cart-badge-pulse' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type='button'
            onClick={() => setMenuOpen(true)}
            className='text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer'
            aria-label='Menu'
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/40'
            onClick={() => setMenuOpen(false)}
            aria-hidden='true'
          />
          <div className='fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl flex flex-col'>
            <div className='flex items-center justify-between px-5 h-14 border-b border-[#E5E5E5]'>
              <span className='text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C1917]'>Menu</span>
              <button
                type='button'
                onClick={() => setMenuOpen(false)}
                className='text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer'
                aria-label='Fermer le menu'
              >
                <CloseIcon />
              </button>
            </div>
            <nav className='flex-1 overflow-y-auto py-4 px-5'>
              <p className='text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D6D3D1] mb-3'>Catégories</p>
              <ul className='flex flex-col gap-1 mb-6'>
                <li>
                  <Link
                    to='/collection'
                    onClick={() => setMenuOpen(false)}
                    className='block py-2.5 text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors border-b border-[#F5F5F5]'
                  >
                    Tout voir
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id ?? cat.name}>
                    <Link
                      to={`/collection?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMenuOpen(false)}
                      className='block py-2.5 text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors border-b border-[#F5F5F5]'
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to='/collection?deal=1'
                    onClick={() => setMenuOpen(false)}
                    className='block py-2.5 text-[13px] font-semibold text-[#e02020] hover:text-[#b01818] transition-colors border-b border-[#F5F5F5]'
                  >
                    Promotions
                  </Link>
                </li>
              </ul>
              <p className='text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D6D3D1] mb-3'>Mon compte</p>
              <ul className='flex flex-col gap-1'>
                {token ? (
                  <>
                    {[
                      { label: 'Mon profil', path: '/profile' },
                      { label: 'Mes commandes', path: '/profile?section=orders' },
                      { label: 'Mes favoris', path: '/profile?section=favorites' },
                      { label: 'Suivre ma commande', path: '/order-status' },
                    ].map(({ label, path }) => (
                      <li key={label}>
                        <Link
                          to={path}
                          onClick={() => setMenuOpen(false)}
                          className='block py-2.5 text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors border-b border-[#F5F5F5]'
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        type='button'
                        onClick={() => { setMenuOpen(false); logout() }}
                        className='w-full text-left py-2.5 text-[13px] font-medium text-[#A8A29E] hover:text-[#1C1917] transition-colors border-b border-[#F5F5F5] cursor-pointer'
                      >
                        Déconnexion
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to='/login'
                      onClick={() => setMenuOpen(false)}
                      className='block py-2.5 text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors border-b border-[#F5F5F5]'
                    >
                      Se connecter / S&apos;inscrire
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/30'
            onClick={() => setSearchOpen(false)}
            aria-hidden='true'
          />
          <div className='fixed inset-x-0 top-0 z-50 bg-white border-b border-[#E5E5E5] shadow-sm animate-slide-down'>
            <form
              onSubmit={handleSearchSubmit}
              className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex items-center gap-4 h-16'
            >
              <SearchIcon />
              <input
                ref={searchInputRef}
                type='search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Rechercher un produit…'
                className='flex-1 bg-transparent text-[14px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none'
              />
              <button
                type='button'
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className='text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer'
                aria-label='Fermer la recherche'
              >
                <CloseIcon />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
