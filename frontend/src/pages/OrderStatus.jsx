import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { trackGuestOrder } from '../api/client'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const OrderStatus = () => {
  const { orderId } = useParams()
  const location = useLocation()
  const { currency } = useContext(ShopContext)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderIdInput, setOrderIdInput] = useState(orderId || '')
  const [emailInput, setEmailInput] = useState(location.state?.email || '')

  const fetchOrder = async (id, email) => {
    if (!id?.trim() || !email?.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await trackGuestOrder(id.trim(), email.trim())
      if (res.data.success && res.data.order) {
        setOrder(res.data.order)
        setOrderIdInput(id.trim())
        setEmailInput(email.trim())
      } else {
        setError(res.data.message || 'Could not find order')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not load order'
      setError(msg)
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId && location.state?.email) {
      fetchOrder(orderId, location.state.email)
    }
  }, [orderId])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchOrder(orderIdInput, emailInput)
  }

  return (
    <div className='border-t pt-14 pb-20'>
      <Helmet>
        <title>Track Order | Elite</title>
        <meta name="description" content="Track your Elite order. Enter your order ID and email to view status." />
      </Helmet>
      <div className='mb-6'>
        <Title text1='TRACK' text2='ORDER' />
      </div>

      {!order ? (
        <div className='max-w-md'>
          <p className='text-gray-600 mb-4'>
            Enter your order ID and email to view your order status. You can find the order ID in your confirmation email.
          </p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Order ID</label>
              <input
                type='text'
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder='e.g. 674a1b2c3d4e5f6789'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder='Email used when placing the order'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
                required
              />
            </div>
            {error && (
              <p className='text-red-600 text-sm'>{error}</p>
            )}
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Checking...' : 'View order'}
            </button>
          </form>
        </div>
      ) : (
        <div className='max-w-2xl'>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center'>
              <div>
                <p className='text-xs text-gray-500'>Order ID</p>
                <p className='font-mono text-sm text-gray-800' title={order._id}>#{String(order._id).slice(-8)}</p>
                <p className='text-xs text-gray-400 mt-0.5'>Save this ID to track later: {order._id}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Date</p>
                <p className='text-sm font-medium'>{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Status</p>
                <p className='text-sm font-medium text-gray-900'>{order.status}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Total</p>
                <p className='text-sm font-medium'>{currency}{order.amount}</p>
              </div>
            </div>

            <div className='p-6'>
              <p className='text-sm font-medium text-gray-700 mb-3'>Items</p>
              <ul className='space-y-3'>
                {(order.items || []).map((item, i) => (
                  <li key={i} className='flex gap-4 items-center border-b border-gray-100 pb-3 last:border-0'>
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className='w-16 h-16 object-cover rounded'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900 truncate'>{item.name}</p>
                      <p className='text-sm text-gray-500'>
                        Qty: {item.quantity}
                        {item.color && ` · ${item.color}`}
                      </p>
                    </div>
                    <p className='font-medium'>
                      {currency}{(item.displayPrice ?? item.newPrice ?? item.price) * (item.quantity || 1)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {order.address && (
              <div className='px-6 pb-6'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Delivery address</p>
                <p className='text-sm text-gray-600'>
                  {[order.address.firstName, order.address.lastName].filter(Boolean).join(' ')}<br />
                  {order.address.street}<br />
                  {[order.address.city, order.address.state, order.address.zipcode].filter(Boolean).join(', ')} {order.address.country}<br />
                  {order.address.phone && `Tel: ${order.address.phone}`}
                </p>
              </div>
            )}
          </div>

          <button
            type='button'
            onClick={() => { setOrder(null); setError(null) }}
            className='mt-6 text-sm text-gray-600 hover:text-gray-900 underline'
          >
            Look up another order
          </button>
        </div>
      )}

      <p className='mt-8 text-sm text-gray-500'>
        <Link to='/collection' className='hover:text-gray-900 underline'>Continue shopping</Link>
      </p>
    </div>
  )
}

export default OrderStatus
