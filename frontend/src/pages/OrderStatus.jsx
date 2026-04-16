/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { trackGuestOrder, trackGuestOrdersByEmail } from '../api/client'

/* ── Status badge (matches Profile.jsx) ── */
const StatusBadge = ({ status }) => {
  const map = {
    'Order Placed':     { label: 'Commande passée',  cls: 'bg-[#F0EDE8] text-[#57534E]' },
    'Packing':          { label: 'En préparation',   cls: 'bg-[#FEF9C3] text-[#854D0E]' },
    'Shipped':          { label: 'Expédiée',          cls: 'bg-[#DBEAFE] text-[#1E40AF]' },
    'Out for delivery': { label: 'En livraison',     cls: 'bg-[#DCFCE7] text-[#166534]' },
    'Delivered':        { label: 'Livrée',            cls: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' },
  }
  const s = map[status] || { label: status, cls: 'bg-[#F0EDE8] text-[#57534E]' }
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${s.cls}`}>
      {s.label}
    </span>
  )
}

/* ── Step progress bar ── */
const STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
const OrderProgress = ({ status }) => {
  const current = STEPS.indexOf(status)
  return (
    <div className='flex items-center gap-0'>
      {STEPS.map((step, i) => {
        const done = i <= current
        const active = i === current
        return (
          <div key={step} className='flex flex-1 flex-col items-center gap-1.5 last:flex-none'>
            <div className='flex w-full items-center'>
              {i > 0 && (
                <div className={`h-px flex-1 transition-colors ${done ? 'bg-[#1C1917]' : 'bg-[#E5E5E5]'}`} />
              )}
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center transition-colors ${
                  active
                    ? 'bg-[#A16207]'
                    : done
                    ? 'bg-[#1C1917]'
                    : 'bg-[#E5E5E5]'
                }`}
              >
                {done ? (
                  <svg className='h-2.5 w-2.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={3}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                  </svg>
                ) : (
                  <span className='h-1.5 w-1.5 bg-[#A8A29E]' />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 transition-colors ${i < current ? 'bg-[#1C1917]' : 'bg-[#E5E5E5]'}`} />
              )}
            </div>
            <span className={`hidden text-center text-[9px] uppercase tracking-[0.12em] sm:block ${active ? 'text-[#A16207]' : done ? 'text-[#57534E]' : 'text-[#D6D3D1]'}`}>
              {step === 'Order Placed' ? 'Passée' : step === 'Packing' ? 'Préparation' : step === 'Shipped' ? 'Expédiée' : step === 'Out for delivery' ? 'Livraison' : 'Livrée'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Order detail card ── */
const OrderCard = ({ order, currency, isNew = false }) => (
  <div className={`border bg-white ${isNew ? 'border-[#A16207] ring-1 ring-[#A16207]/20' : 'border-[#E5E5E5]'}`}>
    {/* New order strip */}
    {isNew && (
      <div className='flex items-center gap-2 bg-[#A16207] px-5 py-1.5'>
        <svg className='h-3 w-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
        </svg>
        <span className='text-[10px] font-semibold uppercase tracking-[0.2em] text-white'>Commande confirmée</span>
      </div>
    )}

    {/* Header row */}
    <div className='flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#F0EDE8] px-5 py-3'>
      <span className='font-mono text-[11px] text-[#A8A29E]'>#{String(order._id).slice(-8).toUpperCase()}</span>
      <span className='text-[11px] text-[#57534E]'>
        {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </span>
      <StatusBadge status={order.status} />
      <span className='ml-auto text-sm font-semibold text-[#1C1917]'>{order.amount}{currency}</span>
    </div>

    {/* Progress */}
    <div className='border-b border-[#F0EDE8] px-5 py-5'>
      <OrderProgress status={order.status} />
    </div>

    {/* Items */}
    <div className='divide-y divide-[#F0EDE8]'>
      {(order.items || []).map((item, i) => (
        <div key={i} className='flex items-center gap-4 px-5 py-3.5'>
          <div className='h-14 w-14 flex-shrink-0 overflow-hidden bg-[#F0EDE8]'>
            {item.image?.[0] && (
              <img src={item.image[0]} alt={item.name} className='h-full w-full object-cover' loading='lazy' />
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium text-[#1C1917]'>{item.name}</p>
            <p className='mt-0.5 text-[11px] text-[#A8A29E]'>
              Qté : {item.quantity}
              {item.color ? ` · ${item.color}` : ''}
            </p>
          </div>
          <span className='flex-shrink-0 text-sm font-medium text-[#1C1917]'>
            {(item.displayPrice ?? item.newPrice ?? item.price) * (item.quantity || 1)}{currency}
          </span>
        </div>
      ))}
    </div>

    {/* Delivery address */}
    {order.address && (
      <div className='border-t border-[#F0EDE8] px-5 py-4'>
        <p className='mb-2 text-[10px] uppercase tracking-[0.18em] text-[#A8A29E]'>Adresse de livraison</p>
        <p className='text-sm text-[#57534E] leading-[1.7]'>
          {[order.address.firstName, order.address.lastName].filter(Boolean).join(' ')}<br />
          {order.address.street}<br />
          {[order.address.city, order.address.state, order.address.zipcode].filter(Boolean).join(', ')}{order.address.country ? `, ${order.address.country}` : ''}<br />
          {order.address.phone && `Tél : ${order.address.phone}`}
        </p>
      </div>
    )}
  </div>
)

/* ══════════════════════════════════════════════ */
const OrderStatus = () => {
  const { orderId } = useParams()
  const location = useLocation()
  const { currency } = useContext(ShopContext)

  const [emailInput, setEmailInput] = useState(location.state?.email || '')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  /* Auto-fetch when arriving from checkout */
  useEffect(() => {
    if (orderId && location.state?.email) {
      fetchByOrderId(orderId, location.state.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const fetchByOrderId = async (id, email) => {
    setLoading(true)
    setError(null)
    try {
      const res = await trackGuestOrder(id, email)
      if (res.data.success && res.data.order) {
        setOrders([res.data.order])
        setSearched(true)
      } else {
        setError(res.data.message || 'Commande introuvable')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger la commande')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = emailInput.trim()
    if (!email) return
    setLoading(true)
    setError(null)
    setOrders([])
    try {
      const res = await trackGuestOrdersByEmail(email)
      if (res.data.success && res.data.orders?.length) {
        setOrders(res.data.orders)
        setSearched(true)
      } else {
        setError(res.data.message || 'Aucune commande trouvée.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Aucune commande trouvée pour cet e-mail.')
    } finally {
      setLoading(false)
    }
  }

  const isDirectFromCheckout = !!orderId && orders.length === 1

  return (
    <main className='border-t border-[#E5E5E5] pb-20 pt-10'>
      <Helmet>
        <title>Suivre ma commande | Elite</title>
        <meta name='description' content='Suivez vos commandes Elite avec votre adresse e-mail.' />
      </Helmet>

      {/* Page header */}
      <div className='mb-10'>
        <span className='section-eyebrow'>Commandes invité</span>
        <h1 className='mt-2 font-display text-3xl font-semibold text-[#1C1917] sm:text-4xl'>
          Suivre ma commande
        </h1>
      </div>

      <div className='grid gap-10 lg:grid-cols-[360px_1fr] lg:items-start'>

        {/* ── Left: email form ── */}
        <div className='border border-[#E5E5E5] bg-white p-6 sm:p-7'>
          <p className='section-eyebrow mb-3'>Recherche</p>
          <p className='mb-5 text-sm leading-[1.7] text-[#57534E]'>
            Entrez l&apos;adresse e-mail utilisée lors de votre commande pour voir toutes vos commandes.
          </p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4' noValidate>
            <div>
              <label htmlFor='tracking-email' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                Adresse e-mail
              </label>
              <input
                id='tracking-email'
                type='email'
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder='votre@email.com'
                required
                autoComplete='email'
                className='shop-input'
              />
            </div>

            {error && (
              <div className='flex items-start gap-2 border border-[#e02020]/20 bg-[#FFF5F5] px-4 py-3'>
                <svg className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#e02020]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
                </svg>
                <p className='text-[12px] text-[#e02020]'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Recherche...' : 'Voir mes commandes'}
            </button>
          </form>

          {searched && orders.length > 0 && (
            <button
              type='button'
              onClick={() => { setOrders([]); setSearched(false); setError(null) }}
              className='mt-4 text-[11px] uppercase tracking-[0.1em] text-[#A8A29E] transition-colors hover:text-[#1C1917]'
            >
              Nouvelle recherche
            </button>
          )}

          <div className='mt-8 border-t border-[#F0EDE8] pt-5'>
            <p className='text-[11px] uppercase tracking-[0.18em] text-[#A8A29E]'>Vous avez un compte ?</p>
            <Link
              to='/login'
              className='mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] transition-colors hover:text-[#A16207]'
            >
              Se connecter pour voir vos commandes
              <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Right: results ── */}
        <div>
          {!searched && !loading && (
            <div className='flex flex-col items-center justify-center gap-4 border border-dashed border-[#D6D3D1] py-20 text-center'>
              <svg className='h-8 w-8 text-[#D6D3D1]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
              </svg>
              <p className='text-sm text-[#A8A29E]'>Entrez votre e-mail pour afficher vos commandes.</p>
            </div>
          )}

          {loading && (
            <div className='flex items-center justify-center py-20'>
              <span className='text-[11px] uppercase tracking-[0.25em] text-[#A8A29E]'>Chargement...</span>
            </div>
          )}

          {searched && orders.length > 0 && (
            <div className='flex flex-col gap-5'>
              <p className='text-[11px] uppercase tracking-[0.18em] text-[#A8A29E]'>
                {orders.length} commande{orders.length > 1 ? 's' : ''} trouvée{orders.length > 1 ? 's' : ''}
              </p>
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  currency={currency}
                  isNew={isDirectFromCheckout}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='mt-12 border-t border-[#E5E5E5] pt-6'>
        <Link to='/collection' className='luxury-link'>
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
          </svg>
          Continuer mes achats
        </Link>
      </div>
    </main>
  )
}

export default OrderStatus
