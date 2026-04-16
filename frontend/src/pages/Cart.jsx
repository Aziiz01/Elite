import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import CheckoutAuthModal from '../components/CheckoutAuthModal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({ _id: items, color: item, quantity: cartItems[items][item] })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  const validCartCount = cartData.filter((item) => {
    const p = products.find((pr) => pr._id === item._id)
    return p && p.inStock !== false
  }).length

  return (
    <div className='border-t border-[#e5e5e5] pt-10'>
      <Helmet>
        <title>Votre panier | Elite</title>
        <meta name='description' content='Consultez votre panier et passez commande. Paiement à la livraison disponible.' />
      </Helmet>

      <div className='mb-8'>
        <p className='section-eyebrow mb-1'>Récapitulatif</p>
        <h1 className='text-2xl font-bold text-[#111]'>Votre panier</h1>
      </div>

      {cartData.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-[#111] font-medium mb-2'>Votre panier est vide</p>
          <p className='text-[13px] text-[#888] mb-8'>Ajoutez des articles pour commencer.</p>
          <Link to='/collection' className='btn-primary'>Découvrir la collection</Link>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row gap-10'>
          {/* Cart items */}
          <div className='flex-1'>
            {cartData.map((item) => {
              const productData = products.find((p) => p._id === item._id)
              const colorHex = /^#[0-9A-Fa-f]{6}$/.test(item.color) ? item.color : '#9ca3af'

              if (!productData) {
                return (
                  <div key={`${item._id}-${item.color}-unavailable`} className='flex items-center gap-4 py-4 border-b border-[#f0f0f0]'>
                    <div className='w-16 h-20 bg-[#f5f5f5] flex-shrink-0 flex items-center justify-center'>
                      <span className='text-[#bbb] text-xs'>—</span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-[13px] text-[#aaa]'>Produit indisponible</p>
                      <p className='text-[11px] text-[#bbb] mt-0.5'>L'article a peut-être été retiré du catalogue</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => updateQuantity(item._id, item.color, 0)}
                      className='text-[#bbb] hover:text-[#e02020] transition-colors cursor-pointer'
                      aria-label='Supprimer'
                    >
                      <img src={assets.bin_icon} className='w-4 h-4 opacity-40 hover:opacity-70' alt='Supprimer' />
                    </button>
                  </div>
                )
              }

              const isOutOfStock = productData.inStock === false
              const displayPrice = productData.newPrice != null && productData.newPrice !== ''
                ? Number(productData.newPrice)
                : Number(productData.price)

              return (
                <div
                  key={`${item._id}-${item.color}`}
                  className={`flex items-start gap-4 sm:gap-5 py-5 border-b border-[#f0f0f0] ${isOutOfStock ? 'opacity-60' : ''}`}
                >
                  {/* Image */}
                  <Link to={`/product/${item._id}`} onClick={() => scrollTo(0, 0)} className='flex-shrink-0'>
                    <div className='w-16 h-20 sm:w-20 sm:h-24 bg-[#f5f5f5] overflow-hidden'>
                      <img
                        src={productData.image?.[0]}
                        alt={productData.name}
                        className='w-full h-full object-contain'
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <Link to={`/product/${item._id}`} onClick={() => scrollTo(0, 0)}>
                      <p className='text-[13px] font-medium text-[#111] leading-snug line-clamp-2 hover:text-[#555] transition-colors'>
                        {productData.name}
                      </p>
                    </Link>

                    <div className='mt-1.5 flex items-center gap-2 flex-wrap'>
                      {productData.newPrice != null && productData.newPrice !== '' ? (
                        <div className='flex items-baseline gap-1.5'>
                          <span className='text-[13px] font-semibold text-[#e02020]'>{displayPrice}{currency}</span>
                          <span className='text-[11px] text-[#bbb] line-through'>{productData.price}{currency}</span>
                        </div>
                      ) : (
                        <span className='text-[13px] font-semibold text-[#111]'>{displayPrice}{currency}</span>
                      )}
                      <span
                        className='w-4 h-4 rounded-full border border-[#ddd] flex-shrink-0 inline-block'
                        style={{ backgroundColor: colorHex }}
                        title={item.color}
                      />
                      {isOutOfStock && (
                        <span className='text-[10px] font-semibold uppercase tracking-[0.1em] text-[#e02020]'>Rupture de stock</span>
                      )}
                    </div>

                    {/* Quantity + delete */}
                    <div className='mt-3 flex items-center gap-3'>
                      <div className='flex items-center'>
                        <button
                          type='button'
                          disabled={isOutOfStock}
                          onClick={() => updateQuantity(item._id, item.color, Math.max(0, item.quantity - 1))}
                          className='w-7 h-7 border border-[#e5e5e5] flex items-center justify-center text-[#555] hover:border-[#111] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 text-sm'
                        >
                          −
                        </button>
                        <input
                          type='number'
                          min={1}
                          value={item.quantity}
                          disabled={isOutOfStock}
                          onChange={(e) => {
                            if (isOutOfStock) return
                            const num = parseInt(e.target.value, 10)
                            if (!isNaN(num) && num >= 0) updateQuantity(item._id, item.color, num)
                          }}
                          className='w-10 h-7 border-y border-[#e5e5e5] text-center text-[12px] text-[#111] focus:outline-none disabled:bg-[#f8f8f8] disabled:cursor-not-allowed'
                        />
                        <button
                          type='button'
                          disabled={isOutOfStock}
                          onClick={() => updateQuantity(item._id, item.color, item.quantity + 1)}
                          className='w-7 h-7 border border-[#e5e5e5] flex items-center justify-center text-[#555] hover:border-[#111] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 text-sm'
                        >
                          +
                        </button>
                      </div>
                      <button
                        type='button'
                        onClick={() => updateQuantity(item._id, item.color, 0)}
                        className='text-[11px] text-[#bbb] hover:text-[#e02020] transition-colors cursor-pointer uppercase tracking-[0.1em]'
                        aria-label='Supprimer'
                      >
                        Retirer
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className='flex-shrink-0 text-right'>
                    <p className='text-[13px] font-semibold text-[#111]'>
                      {(displayPrice * item.quantity).toFixed(2)}{currency}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary */}
          <div className='lg:w-80 flex-shrink-0'>
            <div className='border border-[#e5e5e5] p-6'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111] mb-5'>Résumé de commande</p>
              <CartTotal />
              <button
                onClick={() => {
                  if (token || localStorage.getItem('token')) {
                    navigate('/place-order')
                  } else {
                    setShowCheckoutModal(true)
                  }
                }}
                disabled={validCartCount === 0}
                className='btn-primary w-full mt-5'
              >
                Passer commande
              </button>
              <Link
                to='/collection'
                className='mt-3 block text-center text-[11px] text-[#888] hover:text-[#111] transition-colors uppercase tracking-[0.1em]'
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      )}

      <CheckoutAuthModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} />
    </div>
  )
}

export default Cart
