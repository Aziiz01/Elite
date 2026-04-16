/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getUserProfile, updateProfile, getUserOrders, getFavoritesApi, removeFavoriteApi } from '../api/client'
import { toast } from 'react-toastify'

const SECTIONS = { editProfile: 'editProfile', orders: 'orders', favorites: 'favorites' }

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    'Order Placed': { label: 'Commande passée', cls: 'bg-[#F0EDE8] text-[#57534E]' },
    'Packing': { label: 'En préparation', cls: 'bg-[#FEF9C3] text-[#854D0E]' },
    'Shipped': { label: 'Expédiée', cls: 'bg-[#DBEAFE] text-[#1E40AF]' },
    'Out for delivery': { label: 'En livraison', cls: 'bg-[#DCFCE7] text-[#166534]' },
    'Delivered': { label: 'Livrée', cls: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' },
  }
  const s = map[status] || { label: status, cls: 'bg-[#F0EDE8] text-[#57534E]' }
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${s.cls}`}>
      {s.label}
    </span>
  )
}

const Profile = () => {
  const { token, currency, navigate, setToken, setCartItems, loadFavorites } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState(SECTIONS.editProfile)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [editForm, setEditForm] = useState({ address: '', telephone: '', newPassword: '' })
  const newOrderId = location.state?.newOrderId || null
  const [showConfirm, setShowConfirm] = useState(!!location.state?.newOrderId)
  const newOrderRef = useRef(null)

  const authToken = token || localStorage.getItem('token')

  useEffect(() => {
    const s = searchParams.get('section')
    if (s && Object.values(SECTIONS).includes(s)) setSection(s)
  }, [searchParams])

  /* Auto-dismiss confirmation banner after 8 seconds */
  useEffect(() => {
    if (!showConfirm) return
    const t = setTimeout(() => setShowConfirm(false), 8000)
    return () => clearTimeout(t)
  }, [showConfirm])

  /* Scroll new order card into view once orders load */
  useEffect(() => {
    if (newOrderId && newOrderRef.current) {
      newOrderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [newOrderId, orders])

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { redirect: '/profile' } })
      return
    }
    Promise.all([
      getUserProfile(authToken),
      getUserOrders(authToken),
      getFavoritesApi(authToken),
    ])
      .then(([profileRes, ordersRes, favRes]) => {
        if (profileRes.data.success && profileRes.data.user) {
          const u = profileRes.data.user
          setUser(u)
          setEditForm({ address: u.address || '', telephone: u.telephone || '', newPassword: '' })
        }
        if (ordersRes.data.success) {
          setOrders((ordersRes.data.orders || []).reverse())
        }
        if (favRes?.data?.success && Array.isArray(favRes.data.favorites)) {
          setFavorites(favRes.data.favorites)
        }
      })
      .catch(() => toast.error('Échec du chargement du profil'))
      .finally(() => setLoading(false))
  }, [authToken, navigate])

  const goTo = (s) => {
    setSection(s)
    setSearchParams({ section: s })
  }

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { address: editForm.address, telephone: editForm.telephone }
      if (editForm.newPassword.trim()) payload.newPassword = editForm.newPassword
      const res = await updateProfile(payload, authToken)
      if (res.data.success) {
        toast.success('Profil mis à jour')
        setUser((prev) => prev ? { ...prev, address: editForm.address, telephone: editForm.telephone } : null)
        setEditForm((prev) => ({ ...prev, newPassword: '' }))
      } else {
        toast.error(res.data.message || 'Échec de la mise à jour')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Échec de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveFavorite = async (productId) => {
    try {
      const res = await removeFavoriteApi(productId, authToken)
      if (res.data.success) {
        setFavorites((prev) => prev.filter((f) => String(f.productId) !== String(productId)))
        loadFavorites?.(authToken)
        toast.success('Retiré des favoris')
      } else {
        toast.error(res.data.message || 'Échec de la suppression')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Échec de la suppression')
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center border-t border-[#E5E5E5] pt-14'>
        <Helmet><title>Chargement | Elite</title></Helmet>
        <span className='text-[11px] uppercase tracking-[0.25em] text-[#A8A29E]'>Chargement...</span>
      </div>
    )
  }

  const userName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Client' : 'Client'
  const userInitial = userName.charAt(0).toUpperCase()

  const navItems = [
    { id: SECTIONS.editProfile, label: 'Mon profil' },
    { id: SECTIONS.orders, label: 'Commandes' },
    { id: SECTIONS.favorites, label: 'Favoris' },
  ]

  return (
    <main>
      <Helmet>
        <title>Mon compte | Elite</title>
        <meta name='description' content='Gérez votre compte Elite. Modifiez votre profil, consultez vos commandes et favoris.' />
      </Helmet>

      {/* ── Account hero ── */}
      <div className='bleed-x border-b border-[#E5E5E5] bg-[#F0EDE8] px-8 py-10 sm:px-12 sm:py-12 md:px-16 lg:px-20'>
        <div className='flex items-center gap-5'>
          <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center bg-[#1C1917] text-xl font-bold text-white sm:h-16 sm:w-16'>
            {userInitial}
          </div>
          <div>
            <span className='luxury-eyebrow'>Mon compte</span>
            <h1
              className='mt-1 font-display font-semibold leading-[0.92] text-[#1C1917]'
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}
            >
              {userName}
            </h1>
            {user?.email && (
              <p className='mt-1 text-[12px] text-[#A8A29E]'>{user.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav tabs ── */}
      <div className='bleed-x border-b border-[#E5E5E5]'>
        <div className='flex overflow-x-auto px-8 sm:px-12 md:px-16 lg:px-20' style={{ scrollbarWidth: 'none' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => goTo(item.id)}
              className={`flex-shrink-0 border-b-2 px-4 py-4 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-150 ${
                section === item.id
                  ? 'border-[#A16207] text-[#1C1917]'
                  : 'border-transparent text-[#A8A29E] hover:text-[#57534E]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className='ml-auto flex-shrink-0'>
            <button
              type='button'
              onClick={logout}
              className='border-b-2 border-transparent px-4 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A8A29E] transition-colors hover:text-[#e02020]'
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className='py-10 sm:py-14'>

        {/* Edit Profile */}
        {section === SECTIONS.editProfile && (
          <div className='grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12'>
            {/* Read-only info card */}
            <div>
              <p className='section-eyebrow mb-4'>Informations du compte</p>
              <div className='border border-[#E5E5E5] bg-white'>
                {[
                  { label: 'Prénom', value: user?.firstName },
                  { label: 'Nom', value: user?.lastName },
                  { label: 'Email', value: user?.email },
                  { label: 'Ville', value: user?.city },
                  { label: 'Code postal', value: user?.postalCode },
                ].filter((r) => r.value).map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-[#F0EDE8]' : ''}`}
                  >
                    <span className='w-24 flex-shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#A8A29E]'>{row.label}</span>
                    <span className='text-sm text-[#1C1917]'>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit form */}
            <div>
              <p className='section-eyebrow mb-4'>Modifier</p>
              <form onSubmit={handleSave} className='flex flex-col gap-5'>
                <div>
                  <label htmlFor='profile-address' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                    Adresse
                  </label>
                  <input
                    id='profile-address'
                    name='address'
                    value={editForm.address}
                    onChange={onChange}
                    required
                    autoComplete='street-address'
                    className='shop-input'
                  />
                </div>
                <div>
                  <label htmlFor='profile-telephone' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                    Téléphone
                  </label>
                  <input
                    id='profile-telephone'
                    name='telephone'
                    type='tel'
                    value={editForm.telephone}
                    onChange={onChange}
                    required
                    minLength={8}
                    autoComplete='tel'
                    className='shop-input'
                  />
                </div>
                <div>
                  <label htmlFor='profile-password' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                    Nouveau mot de passe
                  </label>
                  <input
                    id='profile-password'
                    name='newPassword'
                    type='password'
                    value={editForm.newPassword}
                    onChange={onChange}
                    minLength={8}
                    placeholder="Laisser vide pour conserver l'actuel"
                    autoComplete='new-password'
                    className='shop-input'
                  />
                </div>
                <div className='pt-1'>
                  <button
                    type='submit'
                    disabled={saving}
                    className='btn-primary disabled:opacity-60'
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders */}
        {section === SECTIONS.orders && (
          <div>
            <p className='section-eyebrow mb-6'>Mes commandes</p>

            {/* ── Order confirmation banner ── */}
            {showConfirm && (
              <div className='mb-6 flex items-start justify-between gap-4 border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-4'>
                <div className='flex items-start gap-4'>
                  {/* Checkmark */}
                  <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[#BBF7D0] bg-[#DCFCE7]'>
                    <svg className='h-4 w-4 text-[#166534]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-[#166534]'>Commande confirmée</p>
                    <p className='mt-0.5 text-[12px] text-[#57534E]'>
                      Votre commande a été passée avec succès. Vous serez contacté pour la livraison.
                    </p>
                    {newOrderId && (
                      <p className='mt-1 font-mono text-[11px] text-[#166534]'>
                        Réf. #{String(newOrderId).slice(-8).toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => setShowConfirm(false)}
                  aria-label='Fermer'
                  className='flex-shrink-0 text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <div className='flex flex-col items-center gap-4 border border-[#E5E5E5] py-20 text-center'>
                <svg className='h-8 w-8 text-[#D6D3D1]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' />
                </svg>
                <p className='text-sm text-[#A8A29E]'>Aucune commande pour le moment.</p>
                <Link to='/collection' className='btn-primary mt-2'>Découvrir la boutique</Link>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                {orders.map((order) => {
                  const isNew = newOrderId && String(order._id) === String(newOrderId)
                  return (
                    <div
                      key={order._id}
                      ref={isNew ? newOrderRef : null}
                      className={`border bg-white transition-colors duration-500 ${
                        isNew
                          ? 'border-[#A16207] ring-1 ring-[#A16207]/20'
                          : 'border-[#E5E5E5]'
                      }`}
                    >
                      {/* New order label */}
                      {isNew && (
                        <div className='flex items-center gap-2 bg-[#A16207] px-5 py-1.5'>
                          <svg className='h-3 w-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2.5}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                          </svg>
                          <span className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white'>
                            Nouvelle commande
                          </span>
                        </div>
                      )}

                      {/* Order header */}
                      <div className='flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#F0EDE8] px-5 py-3'>
                        <span className='font-mono text-[11px] text-[#A8A29E]'>#{String(order._id).slice(-8).toUpperCase()}</span>
                        <span className='text-[11px] text-[#57534E]'>{new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <StatusBadge status={order.status} />
                        <span className='ml-auto text-sm font-semibold text-[#1C1917]'>{order.amount}{currency}</span>
                      </div>

                      {/* Products row */}
                      <div className='flex items-center gap-3 px-5 py-3.5'>
                        <div className='flex items-center gap-2'>
                          {(order.items || []).slice(0, 4).map((item, index) => (
                            <div
                              key={`${order._id}-${item?._id || index}`}
                              className='h-12 w-12 flex-shrink-0 overflow-hidden bg-[#F0EDE8]'
                              title={item?.name || 'Produit'}
                            >
                              {item?.image?.[0] ? (
                                <img
                                  src={item.image[0]}
                                  alt={item?.name || 'Produit'}
                                  className='h-full w-full object-cover'
                                  loading='lazy'
                                />
                              ) : (
                                <div className='h-full w-full bg-[#F0EDE8]' />
                              )}
                            </div>
                          ))}
                          {(order.items?.length || 0) > 4 && (
                            <span className='text-[11px] text-[#A8A29E]'>+{order.items.length - 4}</span>
                          )}
                        </div>
                        <div className='ml-auto text-right'>
                          <p className='text-[11px] text-[#A8A29E]'>
                            {(order.items || []).reduce((s, i) => s + (Number(i?.quantity) || 0), 0)} article{(order.items || []).reduce((s, i) => s + (Number(i?.quantity) || 0), 0) > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Favorites */}
        {section === SECTIONS.favorites && (
          <div>
            <p className='section-eyebrow mb-6'>Mes favoris</p>
            {favorites.length === 0 ? (
              <div className='flex flex-col items-center gap-4 border border-[#E5E5E5] py-20 text-center'>
                <svg className='h-8 w-8 text-[#D6D3D1]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
                </svg>
                <p className='text-sm text-[#A8A29E]'>Aucun favori pour le moment.</p>
                <Link to='/collection' className='btn-primary mt-2'>Explorer la collection</Link>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {favorites.map((item) => (
                  <div key={item._id} className='group relative border border-[#E5E5E5] bg-white'>
                    <Link to={`/product/${item.productId}`} className='block' onClick={() => scrollTo(0, 0)}>
                      <div className='aspect-square bg-[#F0EDE8]'>
                        <img
                          src={item.image?.[0]}
                          alt={item.name}
                          className='h-full w-full object-contain'
                          loading='lazy'
                        />
                      </div>
                      <div className='p-3'>
                        <p className='line-clamp-2 text-[12px] text-[#1C1917]'>{item.name}</p>
                        <p className='mt-1.5 text-[12px] font-medium'>
                          {item.newPrice != null && item.newPrice !== '' ? (
                            <>
                              <span className='line-through text-[#A8A29E]'>{item.price}{currency}</span>{' '}
                              <span className='text-[#e02020]'>{item.newPrice}{currency}</span>
                            </>
                          ) : (
                            <span className='text-[#1C1917]'>{item.price}{currency}</span>
                          )}
                        </p>
                      </div>
                    </Link>
                    <button
                      type='button'
                      onClick={() => handleRemoveFavorite(item.productId)}
                      className='absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-white/90 text-[#A8A29E] shadow-sm transition-colors hover:text-[#e02020]'
                      aria-label='Retirer des favoris'
                    >
                      <svg className='h-3.5 w-3.5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default Profile
