import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getUserProfile, updateProfile, getUserOrders } from '../api/client'
import { toast } from 'react-toastify'

const SECTIONS = { editProfile: 'editProfile', orders: 'orders' }

const Profile = () => {
  const { token, currency, navigate, setToken, setCartItems } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState(SECTIONS.editProfile)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
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
    ])
      .then(([profileRes, ordersRes]) => {
        if (profileRes.data.success && profileRes.data.user) {
          const u = profileRes.data.user
          setUser(u)
          setEditForm({ address: u.address || '', telephone: u.telephone || '', newPassword: '' })
        }
        if (ordersRes.data.success) {
          setOrders((ordersRes.data.orders || []).reverse())
        }
      })
      .catch(() => toast.error('Failed to load profile'))
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
        toast.success('Profile updated')
        setUser((prev) => prev ? { ...prev, address: editForm.address, telephone: editForm.telephone } : null)
        setEditForm((prev) => ({ ...prev, newPassword: '' }))
      } else {
        toast.error(res.data.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='border-t pt-14 min-h-[40vh] flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    )
  }

  const userName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User' : 'User'

  return (
    <div className='border-t pt-14 pb-20'>
      <div className='flex flex-col md:flex-row gap-8 md:gap-12'>
        {/* Sidebar */}
        <aside className='md:w-56 flex-shrink-0'>
          <div className='border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6'>
            <p className='text-pink-600 text-sm font-medium mb-4'>Welcome back, {userName}</p>
            <nav className='flex flex-row md:flex-col gap-2 flex-wrap md:flex-nowrap'>
              <button
                onClick={() => goTo(SECTIONS.editProfile)}
                className={`text-left py-2 px-1 text-sm ${section === SECTIONS.editProfile ? 'text-pink-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => goTo(SECTIONS.orders)}
                className={`text-left py-2 px-1 text-sm ${section === SECTIONS.orders ? 'text-pink-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Orders
              </button>
              <button
                onClick={logout}
                className='text-left py-2 px-1 text-sm text-gray-500 hover:text-gray-700 md:mt-4'
              >
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 min-w-0'>
          {section === SECTIONS.orders && (
            <div>
              <h1 className='text-xl font-semibold mb-6 border-b border-gray-200 pb-3'>My Orders</h1>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-200 text-left text-gray-600'>
                      <th className='py-3 pr-4'>N°</th>
                      <th className='py-3 pr-4'>Date</th>
                      <th className='py-3 pr-4'>Status</th>
                      <th className='py-3 pr-4'>Total</th>
                      <th className='py-3'>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='py-8 text-gray-400 text-center'>
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr key={order._id} className='border-b border-gray-100'>
                          <td className='py-4 pr-4 font-mono text-gray-500'>#{String(order._id).slice(-6)}</td>
                          <td className='py-4 pr-4'>{new Date(order.date).toLocaleDateString()}</td>
                          <td className='py-4 pr-4'>{order.status}</td>
                          <td className='py-4 pr-4 font-medium'>{currency}{order.amount}</td>
                          <td className='py-4'>{order.items?.length || 0} item(s)</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === SECTIONS.editProfile && (
            <div>
              <h1 className='text-xl font-semibold mb-6 border-b border-gray-200 pb-3'>Edit Profile</h1>
              <div className='mb-6 text-sm text-gray-600'>
                <p className='font-medium text-gray-800 mb-1'>Account info (read-only)</p>
                <p>{user?.firstName} {user?.lastName}</p>
                <p>{user?.email}</p>
                <p>{user?.city}, {user?.postalCode}</p>
              </div>
              <form onSubmit={handleSave} className='flex flex-col gap-4 max-w-md'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                  <input
                    name='address'
                    value={editForm.address}
                    onChange={onChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Phone number</label>
                  <input
                    name='telephone'
                    type='tel'
                    value={editForm.telephone}
                    onChange={onChange}
                    required
                    minLength={8}
                    className='w-full px-3 py-2 border border-gray-300'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>New password (leave blank to keep)</label>
                  <input
                    name='newPassword'
                    type='password'
                    value={editForm.newPassword}
                    onChange={onChange}
                    minLength={8}
                    placeholder='Min 8 characters'
                    className='w-full px-3 py-2 border border-gray-300'
                  />
                </div>
                <button
                  type='submit'
                  disabled={saving}
                  className='bg-black text-white px-6 py-2.5 text-sm font-medium w-fit disabled:opacity-60'
                >
                  {saving ? 'Saving...' : 'Save changes'}
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
