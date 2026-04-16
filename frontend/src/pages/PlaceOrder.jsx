import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { placeOrder as placeOrderApi, placeGuestOrder, getUserProfile } from '../api/client'
import { toast } from 'react-toastify'

const generateGuestId = () => 'guest-' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`)

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']

const PlaceOrder = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const isGuest = location.state?.isGuest === true
    const guestUserId = useMemo(() => generateGuestId(), [isGuest])

    const [profileLoaded, setProfileLoaded] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    useEffect(() => {
        if (!isGuest && !token && !localStorage.getItem('token')) {
            navigate('/cart')
        }
    }, [isGuest, token, navigate])

    useEffect(() => {
        if (!isGuest && (token || localStorage.getItem('token')) && !profileLoaded) {
            const authToken = token || localStorage.getItem('token')
            getUserProfile(authToken)
                .then((res) => {
                    if (res.data.success && res.data.user) {
                        const u = res.data.user
                        setFormData({
                            firstName: u.firstName || '',
                            lastName: u.lastName || '',
                            email: u.email || '',
                            street: u.address || '',
                            city: u.city || '',
                            state: '',
                            zipcode: u.postalCode || '',
                            country: '',
                            phone: u.telephone || ''
                        })
                    }
                    setProfileLoaded(true)
                })
                .catch(() => setProfileLoaded(true))
        } else if (isGuest) {
            setProfileLoaded(true)
        }
    }, [isGuest, token, profileLoaded])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const FIELD_LABELS = { firstName: 'prénom', lastName: 'nom', email: 'e-mail', street: 'rue', city: 'ville', state: 'région', zipcode: 'code postal', country: 'pays', phone: 'téléphone' }
    const validateForm = () => {
        for (const field of REQUIRED_FIELDS) {
            const val = formData[field]
            if (val == null || String(val).trim() === '') {
                toast.error(`Veuillez remplir le champ ${FIELD_LABELS[field] || field}`)
                return false
            }
        }
        return true
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        if (submitting) return
        try {
            if (!validateForm()) return
            setSubmitting(true)

            let orderItems = []
            let skippedCount = 0

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo && itemInfo.inStock !== false) {
                            itemInfo.color = item
                            itemInfo.quantity = cartItems[items][item]
                            itemInfo.displayPrice = (itemInfo.newPrice != null && itemInfo.newPrice !== '') ? itemInfo.newPrice : itemInfo.price
                            orderItems.push(itemInfo)
                        } else {
                            skippedCount += 1
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error(skippedCount > 0 ? 'Aucun article valide dans le panier. Certains produits sont peut-être indisponibles.' : 'Votre panier est vide')
                return
            }
            if (skippedCount > 0) {
                toast.info(`${skippedCount} article(s) indisponible(s) exclu(s) de votre commande`)
            }

            const amount = getCartAmount() + delivery_fee
            const orderPayload = {
                address: formData,
                items: orderItems,
                amount,
                paymentMethod: 'COD'
            }

            if (isGuest) {
                const guestOrderData = {
                    ...orderPayload,
                    userId: guestUserId
                }
                const response = await placeGuestOrder(guestOrderData)
                if (response.data.success) {
                    const orderId = response.data.orderId
                    setCartItems({})
                    toast.success('Commande passée avec succès')
                    navigate(`/order-status/${orderId}`, { state: { email: formData.email } })
                } else {
                    toast.error(response.data.message || 'Échec de la commande')
                }
                return
            }

            const authToken = token || localStorage.getItem('token')
            if (!authToken) {
                toast.error('Veuillez vous connecter pour passer commande')
                navigate('/login', { state: { redirect: '/place-order' } })
                return
            }

            const response = await placeOrderApi(orderPayload, authToken)
            if (response.data.success) {
                setCartItems({})
                navigate('/profile?section=orders', {
                    state: { newOrderId: response.data.orderId }
                })
            } else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='border-t border-[#e5e5e5] pt-10 min-h-[80vh]'>
            <Helmet>
                <title>Paiement | Elite</title>
                <meta name='description' content='Finalisez votre commande. Paiement à la livraison disponible.' />
            </Helmet>

            <div className='mb-8'>
                <p className='section-eyebrow mb-1'>Commande</p>
                <h1 className='text-2xl font-bold text-[#111]'>Informations de livraison</h1>
            </div>

            <div className='flex flex-col lg:flex-row gap-10'>
                {/* Left — delivery form */}
                <div className='flex-1 flex flex-col gap-3'>
                    {isGuest && (
                        <p className='text-[12px] text-[#555] bg-[#f8f8f8] border border-[#e5e5e5] px-4 py-3'>
                            Commande en tant qu'invité. Veuillez remplir toutes les informations.
                        </p>
                    )}
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='shop-input' type='text' placeholder='Prénom' />
                        <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='shop-input' type='text' placeholder='Nom' />
                    </div>
                    <input required onChange={onChangeHandler} name='email' value={formData.email} className='shop-input' type='email' placeholder='E-mail' />
                    <input required onChange={onChangeHandler} name='street' value={formData.street} className='shop-input' type='text' placeholder='Rue' />
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='city' value={formData.city} className='shop-input' type='text' placeholder='Ville' />
                        <input required onChange={onChangeHandler} name='state' value={formData.state} className='shop-input' type='text' placeholder='Région' />
                    </div>
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='shop-input' type='number' placeholder='Code postal' />
                        <input required onChange={onChangeHandler} name='country' value={formData.country} className='shop-input' type='text' placeholder='Pays' />
                    </div>
                    <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='shop-input' type='number' placeholder='Téléphone' />
                </div>

                {/* Right — summary */}
                <div className='lg:w-80 flex-shrink-0'>
                    <div className='border border-[#e5e5e5] p-6'>
                        <p className='text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111] mb-5'>Résumé de commande</p>
                        <CartTotal />
                        <div className='mt-6 border-t border-[#e5e5e5] pt-5'>
                            <div className='flex items-start gap-2.5 mb-5'>
                                <div className='w-4 h-4 border-2 border-[#111] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-[#111]' />
                                </div>
                                <div>
                                    <p className='text-[12px] font-semibold text-[#111]'>Paiement à la livraison</p>
                                    <p className='text-[11px] text-[#888] mt-0.5'>Payez en espèces à la réception.</p>
                                </div>
                            </div>
                            <button
                                type='submit'
                                disabled={submitting}
                                className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {submitting ? 'Envoi en cours…' : 'Confirmer la commande'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
