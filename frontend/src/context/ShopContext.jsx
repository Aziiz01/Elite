import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    addToCartApi,
    updateCartApi,
    getCart,
    mergeCartApi,
    getProducts,
    getFavoritesApi,
    addFavoriteApi,
    removeFavoriteApi,
    backendUrl,
} from '../api/client'

export const ShopContext = createContext();

const GUEST_CART_KEY = 'guestCart';

const loadGuestCart = () => {
    try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};

const ShopContextProvider = (props) => {

    const currency = ' Dt';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(loadGuestCart);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [favoriteIds, setFavoriteIds] = useState([])
    const [cartPulse, setCartPulse] = useState(false)
    const navigate = useNavigate();


    const addToCart = async (itemId, color, quantity = 1) => {

        if (!color) {
            toast.error('Choisissez une couleur');
            return;
        }

        const qty = Math.max(1, Number(quantity) || 1);
        const prevCart = structuredClone(cartItems);
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += qty;
            }
            else {
                cartData[itemId][color] = qty;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][color] = qty;
        }
        setCartItems(cartData);
        setCartPulse(true);

        if (token) {
            try {
                await addToCartApi({ itemId, color, quantity: qty }, token)
            } catch (error) {
                setCartItems(prevCart)
                setCartPulse(false)
                toast.error(error?.response?.data?.message || error.message)
            }
        }
    }

    useEffect(() => {
        if (!cartPulse) return
        const t = setTimeout(() => setCartPulse(false), 500)
        return () => clearTimeout(t)
    }, [cartPulse])

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, color, quantity) => {

        const prevCart = structuredClone(cartItems);
        let cartData = structuredClone(cartItems);

        if (!cartData[itemId] || cartData[itemId][color] === undefined) {
            return;
        }

        const numQty = Number(quantity);
        if (numQty <= 0) {
            delete cartData[itemId][color];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][color] = numQty;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await updateCartApi({ itemId, color, quantity: numQty }, token)
            } catch (error) {
                setCartItems(prevCart)
                toast.error(error?.response?.data?.message || error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo || itemInfo.inStock === false) continue;
            const displayPrice = (itemInfo.newPrice != null && itemInfo.newPrice !== '') ? itemInfo.newPrice : itemInfo.price;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += displayPrice * cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await getProducts()
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || 'Failed to load products')
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await getCart(token)
            if (response.data.success) {
                setCartItems(response.data.cartData || {})
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const mergeGuestCartThenLoad = async (authToken) => {
        const guestCart = loadGuestCart()
        const hasGuestItems = Object.keys(guestCart).some((itemId) =>
            guestCart[itemId] && typeof guestCart[itemId] === 'object' && Object.keys(guestCart[itemId]).length > 0
        )
        if (hasGuestItems) {
            try {
                await mergeCartApi(guestCart, authToken)
            } catch (e) {
                console.log('Guest cart merge failed:', e)
            }
        }
        localStorage.removeItem(GUEST_CART_KEY)
        await getUserCart(authToken)
    }

    const loadFavorites = async (authToken) => {
        try {
            const res = await getFavoritesApi(authToken)
            if (res.data.success && Array.isArray(res.data.favorites)) {
                setFavoriteIds(res.data.favorites.map((f) => String(f.productId)))
            }
        } catch (e) {
            // Silent fail
        }
    }

    const toggleFavorite = async (productId) => {
        const authToken = token || localStorage.getItem('token')
        if (!authToken) {
            toast.info('Connectez-vous pour ajouter aux favoris')
            navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`)
            return
        }
        const id = String(productId)
        const isFav = favoriteIds.includes(id)
        setFavoriteIds((prev) =>
            isFav ? prev.filter((f) => f !== id) : [...prev, id]
        )
        try {
            if (isFav) {
                await removeFavoriteApi(productId, authToken)
                toast.success('Retiré des favoris')
            } else {
                await addFavoriteApi(productId, authToken)
                toast.success('Ajouté aux favoris')
            }
        } catch (err) {
            setFavoriteIds((prev) => (isFav ? [...prev, id] : prev.filter((f) => f !== id)))
            toast.error(err?.response?.data?.message || 'Échec de la mise à jour des favoris')
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        const authToken = token || localStorage.getItem('token')
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
        if (authToken) {
            mergeGuestCartThenLoad(authToken)
            loadFavorites(authToken)
        } else {
            setCartItems(loadGuestCart())
            setFavoriteIds([])
        }
    }, [token])

    useEffect(() => {
        const authToken = token || localStorage.getItem('token')
        if (!authToken) {
            try {
                localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
            } catch {}
        }
    }, [cartItems, token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, cartPulse,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        favoriteIds, toggleFavorite, loadFavorites
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;