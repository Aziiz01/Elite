import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getCategories } from '../api/client'

const Navbar = () => {

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, cartPulse } = useContext(ShopContext)
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getCategories()
            .then((res) => {
                if (res.data?.success && Array.isArray(res.data.categories)) {
                    setCategories(res.data.categories)
                }
            })
            .catch(() => {})
    }, [])

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        localStorage.removeItem('guestCart')
        setToken('')
        setCartItems({})
    }

  return (
    <div className='relative z-50 flex items-center justify-between py-5 font-medium'>
      
      <Link to='/'><img src={assets.logo} className='w-36' alt="Elite - Home" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        
        <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

      </ul>

      <div className='flex items-center gap-6'>
            <button type='button' onClick={()=> { setShowSearch(true); navigate('/collection') }} className='p-0 border-0 bg-transparent cursor-pointer' aria-label='Search'>
              <img src={assets.search_icon} className='w-5' alt="" aria-hidden />
            </button>
            <div className='relative'>
                <button
                    type='button'
                    onClick={() => token ? setProfileOpen((o) => !o) : navigate('/login')}
                    className='p-0 border-0 bg-transparent cursor-pointer'
                    aria-label='Account menu'
                    aria-expanded={profileOpen}
                    aria-haspopup='true'
                >
                    <img src={assets.profile_icon} className='w-5' alt="" aria-hidden />
                </button>
                {token && profileOpen && (
                    <>
                        <div className='fixed inset-0 z-40' onClick={() => setProfileOpen(false)} aria-hidden="true" />
                        <div className='absolute right-0 pt-4 z-50'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
                                <button type='button' onClick={() => { setProfileOpen(false); navigate('/profile') }} className='text-left cursor-pointer hover:text-black'>My Profile</button>
                                <button type='button' onClick={() => { setProfileOpen(false); navigate('/profile?section=favorites') }} className='text-left cursor-pointer hover:text-black'>Favorites</button>
                                <button type='button' onClick={() => { setProfileOpen(false); navigate('/profile?section=orders') }} className='text-left cursor-pointer hover:text-black'>Orders</button>
                                <button type='button' onClick={() => { setProfileOpen(false); logout() }} className='text-left cursor-pointer hover:text-black'>Logout</button>
                            </div>
                        </div>
                    </>
                )}
            </div> 
            <Link to='/cart' className='relative' aria-label={`Cart, ${getCartCount()} items`}>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt="" aria-hidden />
                <p className={`absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] ${cartPulse ? 'cart-badge-pulse' : ''}`}>{getCartCount()}</p>
            </Link>
            <div className='relative group'>
                <button type='button' onClick={() => setMenuOpen(!menuOpen)} className='p-1 -m-1 text-gray-700 hover:text-gray-900' aria-label='Menu' aria-expanded={menuOpen}>
                    <img src={assets.menu_icon} className='w-5 h-5' alt="" aria-hidden />
                </button>
                {menuOpen && (
                    <>
                        <div className='fixed inset-0 z-40' onClick={() => setMenuOpen(false)} aria-hidden="true" />
                        <div className='absolute right-0 top-full pt-2 z-50 min-w-[200px]'>
                            <div className='bg-white border border-gray-200 rounded-lg shadow-lg py-2'>
                                <Link
                                    to='/collection?bestseller=1'
                                    onClick={() => setMenuOpen(false)}
                                    className='block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-100'
                                >
                                    Best Sellers
                                </Link>
                                <Link
                                    to='/collection'
                                    onClick={() => setMenuOpen(false)}
                                    className='block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-100'
                                >
                                    All collections
                                </Link>
                                <p className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Categories</p>
                                {categories.map((c) => (
                                    <Link
                                        key={c._id}
                                        to={`/collection?category=${encodeURIComponent(c.name)}`}
                                        onClick={() => setMenuOpen(false)}
                                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                                <div className='border-t border-gray-100 my-1' />
                                <Link
                                    to='/order-status'
                                    onClick={() => setMenuOpen(false)}
                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                >
                                    Track order
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
      </div>

    </div>
  )
}

export default Navbar
