import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
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
                navigate('/profile?section=orders')
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
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            <Helmet>
                <title>Paiement | Elite</title>
                <meta name="description" content="Finalisez votre commande. Paiement à la livraison disponible." />
            </Helmet>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                {isGuest && (
                    <p className='text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded'>
                        Commande en tant qu'invité. Veuillez remplir toutes les informations requises.
                    </p>
                )}
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'INFORMATIONS'} text2={'LIVRAISON'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Prénom' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Nom' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="email" placeholder='E-mail' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Rue' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Ville' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Région' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="number" placeholder='Code postal' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="text" placeholder='Pays' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:ring-2 focus:ring-gray-400 focus:border-transparent' type="number" placeholder='Téléphone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <p className='text-sm text-gray-600 mb-4'>Paiement à la livraison — Payez à la réception de votre commande.</p>
                    <div className='w-full text-end'>
                        <button
                            type='submit'
                            disabled={submitting}
                            className='bg-black text-white px-16 py-3 text-sm rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {submitting ? 'Envoi en cours…' : 'PASSER COMMANDE'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
