import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getUserProfile, updateProfile, getUserOrders, getFavoritesApi, removeFavoriteApi } from '../api/client'
import { toast } from 'react-toastify'

const SECTIONS = { editProfile: 'editProfile', orders: 'orders', favorites: 'favorites' }

const Profile = () => {
  const { token, currency, navigate, setToken, setCartItems, loadFavorites } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState(SECTIONS.editProfile)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [editForm, setEditForm] = useState({ address: '', telephone: '', newPassword: '' })

  const authToken = token || localStorage.getItem('token')

  useEffect(() => {
    const s = searchParams.get('section')
    if (s && Object.values(SECTIONS).includes(s)) setSection(s)
  }, [searchParams])

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
      <div className='border-t pt-14 min-h-[40vh] flex items-center justify-center'>
        <Helmet><title>Chargement | Elite</title></Helmet>
        <p className='text-gray-500'>Chargement...</p>
      </div>
    )
  }

  const userName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User' : 'User'

  return (
    <div className='border-t border-[#efe4db] pt-10 pb-20 sm:pt-14'>
      <Helmet>
        <title>Mon compte | Elite</title>
        <meta name="description" content="Gérez votre compte Elite. Modifiez votre profil, consultez vos commandes et favoris." />
      </Helmet>
      <section className='mb-8 rounded-[2rem] border border-[#e9ddd3] bg-[#f7efe8] p-6 sm:p-8 md:p-10'>
        <p className='luxury-eyebrow'>Mon compte</p>
        <h1 className='luxury-heading mt-2'>Bienvenue, {userName}</h1>
        <p className='mt-3 text-sm text-[#5f4d41]'>Gérez vos informations, commandes et favoris dans un espace unique.</p>
      </section>

      <div className='flex flex-col md:flex-row gap-8 md:gap-12'>
        {/* Sidebar */}
        <aside className='md:w-56 flex-shrink-0'>
          <div className='rounded-3xl border border-[#ecdfd6] bg-[#fdfaf7] p-4 md:p-5'>
            <p className='text-[#8e7767] text-xs uppercase tracking-[0.16em] mb-4'>Menu</p>
            <nav className='flex flex-row md:flex-col gap-2 flex-wrap md:flex-nowrap'>
              <button
                onClick={() => goTo(SECTIONS.editProfile)}
                className={`text-left py-2.5 px-3 rounded-full text-sm transition ${section === SECTIONS.editProfile ? 'bg-[#2f2219] text-white font-medium' : 'text-[#5f4d41] hover:bg-[#f4ebe4]'}`}
              >
                Modifier le profil
              </button>
              <button
                onClick={() => goTo(SECTIONS.orders)}
                className={`text-left py-2.5 px-3 rounded-full text-sm transition ${section === SECTIONS.orders ? 'bg-[#2f2219] text-white font-medium' : 'text-[#5f4d41] hover:bg-[#f4ebe4]'}`}
              >
                Commandes
              </button>
              <button
                onClick={() => goTo(SECTIONS.favorites)}
                className={`text-left py-2.5 px-3 rounded-full text-sm transition ${section === SECTIONS.favorites ? 'bg-[#2f2219] text-white font-medium' : 'text-[#5f4d41] hover:bg-[#f4ebe4]'}`}
              >
                Favoris
              </button>
              <button
                onClick={logout}
                className='text-left py-2.5 px-3 text-sm text-[#8f5f5f] hover:bg-[#f8ecec] rounded-full md:mt-3'
              >
                Déconnexion
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 min-w-0'>
          {section === SECTIONS.orders && (
            <div>
              <h1 className='font-display text-3xl text-[#2f2219] mb-6'>Mes commandes</h1>
              <div className='overflow-x-auto rounded-2xl border border-[#ecdfd6] bg-[#fdfaf7]'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-[#ecdfd6] text-left text-[#7f695c]'>
                      <th className='py-3 pr-4'>N°</th>
                      <th className='py-3 pr-4'>Date</th>
                      <th className='py-3 pr-4'>Produits</th>
                      <th className='py-3 pr-4'>Statut</th>
                      <th className='py-3 pr-4'>Total</th>
                      <th className='py-3'>Qté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className='py-8 text-[#9d887a] text-center'>
                          Aucune commande
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className='border-b border-[#f1e6dd]'>
                          <td className='py-4 pr-4 font-mono text-[#8c7668]'>#{String(order._id).slice(-6)}</td>
                          <td className='py-4 pr-4'>{new Date(order.date).toLocaleDateString()}</td>
                          <td className='py-4 pr-4'>
                            <div className='flex items-center gap-2'>
                              {(order.items || []).slice(0, 3).map((item, index) => (
                                <div
                                  key={`${order._id}-${item?._id || index}`}
                                  className='h-10 w-10 rounded-lg border border-[#ecded3] bg-[#f5ede6] overflow-hidden'
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
                                    <div className='h-full w-full bg-[#f1e6dd]' />
                                  )}
                                </div>
                              ))}
                              {(order.items?.length || 0) > 3 && (
                                <span className='text-xs text-[#8c7668]'>+{order.items.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className='py-4 pr-4'>{order.status}</td>
                          <td className='py-4 pr-4 font-medium text-[#2f2219]'>{order.amount}{currency}</td>
                          <td className='py-4'>
                            {(order.items || []).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === SECTIONS.favorites && (
            <div>
              <h1 className='font-display text-3xl text-[#2f2219] mb-6'>Favoris</h1>
              {favorites.length === 0 ? (
                <p className='text-[#6f5c50] py-8'>Aucun favori. Ajoutez des produits depuis la collection.</p>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {favorites.map((item) => (
                    <div key={item._id} className='group relative border border-[#ecdfd6] rounded-2xl overflow-hidden bg-[#fdfaf7]'>
                      <Link to={`/product/${item.productId}`} className='block' onClick={() => scrollTo(0, 0)}>
                        <div className='aspect-square bg-[#f5ede6]'>
                          <img
                            src={item.image?.[0]}
                            alt={item.name}
                            className='w-full h-full object-contain'
                          />
                        </div>
                        <div className='p-3'>
                          <p className='text-sm line-clamp-2 text-[#2f2219]'>{item.name}</p>
                          <p className='text-sm font-medium mt-1'>
                            {item.newPrice != null && item.newPrice !== '' ? (
                              <span><span className='line-through text-[#8f7a6c]'>{item.price}{currency}</span> <span className='text-[#2f2219]'>{item.newPrice}{currency}</span></span>
                            ) : (
                              <span>{item.price}{currency}</span>
                            )}
                          </p>
                        </div>
                      </Link>
                      <button
                        type='button'
                        onClick={() => handleRemoveFavorite(item.productId)}
                        className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-[#7c6a5d] hover:text-pink-500 hover:bg-white shadow-sm'
                        aria-label='Retirer des favoris'
                      >
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === SECTIONS.editProfile && (
            <div>
              <h1 className='font-display text-3xl text-[#2f2219] mb-6'>Modifier le profil</h1>
              <div className='mb-6 text-sm text-[#5f4d41] rounded-2xl border border-[#ecdfd6] bg-[#fdfaf7] p-4'>
                <p className='font-medium text-[#2f2219] mb-1'>Informations du compte (lecture seule)</p>
                <p>{user?.firstName} {user?.lastName}</p>
                <p>{user?.email}</p>
                <p>{user?.city}, {user?.postalCode}</p>
              </div>
              <form onSubmit={handleSave} className='flex flex-col gap-4 max-w-md'>
                <div>
                  <label className='block text-sm font-medium text-[#5f4d41] mb-1'>Adresse</label>
                  <input
                    name='address'
                    value={editForm.address}
                    onChange={onChange}
                    required
                    className='w-full px-4 py-2.5 border border-[#dccabf] rounded-xl bg-white focus:border-[#a88f7f]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-[#5f4d41] mb-1'>Téléphone</label>
                  <input
                    name='telephone'
                    type='tel'
                    value={editForm.telephone}
                    onChange={onChange}
                    required
                    minLength={8}
                    className='w-full px-4 py-2.5 border border-[#dccabf] rounded-xl bg-white focus:border-[#a88f7f]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-[#5f4d41] mb-1'>Nouveau mot de passe (laisser vide pour conserver)</label>
                  <input
                    name='newPassword'
                    type='password'
                    value={editForm.newPassword}
                    onChange={onChange}
                    minLength={8}
                    placeholder='Min. 8 caractères'
                    className='w-full px-4 py-2.5 border border-[#dccabf] rounded-xl bg-white focus:border-[#a88f7f]'
                  />
                </div>
                <button
                  type='submit'
                  disabled={saving}
                  className='luxury-btn-primary w-fit disabled:opacity-60'
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Profile
