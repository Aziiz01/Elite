import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    addToCartApi,
    updateCartApi,
    getCart,
    getProducts,
    getFavoritesApi,
    addFavoriteApi,
    removeFavoriteApi,
    backendUrl,
} from '../api/client'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'Dt ';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [favoriteIds, setFavoriteIds] = useState([])
    const navigate = useNavigate();


    const addToCart = async (itemId, color, quantity = 1) => {

        if (!color) {
            toast.error('Select a color');
            return;
        }

        const qty = Math.max(1, Number(quantity) || 1);
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

        if (token) {
            try {
                await addToCartApi({ itemId, color, quantity: qty }, token)
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }

    }

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

        let cartData = structuredClone(cartItems);

        cartData[itemId][color] = quantity;

        setCartItems(cartData)

        if (token) {
            try {
                await updateCartApi({ itemId, color, quantity }, token)
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
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
            toast.info('Login to add favorites')
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
                toast.success('Removed from favorites')
            } else {
                await addFavoriteApi(productId, authToken)
                toast.success('Added to favorites')
            }
        } catch (err) {
            setFavoriteIds((prev) => (isFav ? [...prev, id] : prev.filter((f) => f !== id)))
            toast.error(err?.response?.data?.message || 'Failed to update favorites')
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
            getUserCart(authToken)
            loadFavorites(authToken)
        } else {
            setFavoriteIds([])
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
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