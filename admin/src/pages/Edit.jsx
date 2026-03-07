import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [subCategoryId, setSubCategoryId] = useState("")
  const [bestseller, setBestseller] = useState(false)
  const [inStock, setInStock] = useState(true)
  const [colors, setColors] = useState([])
  const [colorPickerValue, setColorPickerValue] = useState("#000000")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/category/list")
        if (res.data.success && res.data.categories?.length) {
          setCategories(res.data.categories)
        }
      } catch (e) {
        toast.error("Failed to load categories")
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([])
      setSubCategoryId("")
      return
    }
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/category/subcategories", { params: { categoryId } })
        if (res.data.success) {
          const subs = res.data.subcategories || []
          setSubcategories(subs)
          setSubCategoryId(prev => (prev && subs.some(s => s._id === prev)) ? prev : "")
        }
      } catch (e) {
        setSubcategories([])
        setSubCategoryId("")
      }
    }
    fetchSubcategories()
  }, [categoryId])

  const isValidHex = (hex) => /^#[0-9A-Fa-f]{6}$/.test(hex)

  const addColor = (hex) => {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`
    if (!isValidHex(normalized)) {
      toast.error("Please select a valid color")
      return
    }
    if (!colors.includes(normalized)) {
      setColors([...colors, normalized])
    }
  }

  const removeColor = (color) => {
    setColors(colors.filter(c => c !== color))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/product/single', { productId: id })
        if (response.data.success && response.data.product) {
          const p = response.data.product
          setName(p.name || "")
          setDescription(p.description || "")
          setPrice(p.price?.toString() || "")
          setNewPrice(p.newPrice != null && p.newPrice !== '' ? p.newPrice.toString() : "")
          setCategoryId(p.categoryId?._id || p.categoryId || "")
          setSubCategoryId(p.subCategoryId?._id || p.subCategoryId || "")
          setBestseller(p.bestseller || false)
          setInStock(p.inStock !== false)
          const loadedColors = Array.isArray(p.colors) ? p.colors : []
          setColors(loadedColors.filter(c => typeof c === 'string'))
          if (p.image?.length) {
            setImage1(p.image[0] || null)
            setImage2(p.image[1] || null)
            setImage3(p.image[2] || null)
            setImage4(p.image[3] || null)
          }
        } else {
          toast.error(response.data.message || "Product not found")
          navigate('/list')
        }
      } catch (error) {
        toast.error(error.message || "Failed to load product")
        navigate('/list')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id, navigate])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (colors.length === 0) {
      toast.error("At least one color is required")
      return
    }
    if (!categoryId) {
      toast.error("Please select a category")
      return
    }

    try {
      const formData = new FormData()
      formData.append("id", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      if (newPrice) formData.append("newPrice", newPrice)
      formData.append("categoryId", categoryId)
      if (subCategoryId) formData.append("subCategoryId", subCategoryId)
      formData.append("bestseller", bestseller)
      formData.append("inStock", inStock)
      formData.append("colors", JSON.stringify(colors))

      if (image1 instanceof File) formData.append("image1", image1)
      if (image2 instanceof File) formData.append("image2", image2)
      if (image3 instanceof File) formData.append("image3", image3)
      if (image4 instanceof File) formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return <p className="text-gray-600">Loading...</p>
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="edit-image1">
            <img className='w-20 h-20 object-cover border' src={image1 ? (image1 instanceof File ? URL.createObjectURL(image1) : image1) : assets.upload_area} alt="" />
            <input onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage1(f); }} type="file" id="edit-image1" hidden />
          </label>
          <label htmlFor="edit-image2">
            <img className='w-20 h-20 object-cover border' src={image2 ? (image2 instanceof File ? URL.createObjectURL(image2) : image2) : assets.upload_area} alt="" />
            <input onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage2(f); }} type="file" id="edit-image2" hidden />
          </label>
          <label htmlFor="edit-image3">
            <img className='w-20 h-20 object-cover border' src={image3 ? (image3 instanceof File ? URL.createObjectURL(image3) : image3) : assets.upload_area} alt="" />
            <input onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage3(f); }} type="file" id="edit-image3" hidden />
          </label>
          <label htmlFor="edit-image4">
            <img className='w-20 h-20 object-cover border' src={image4 ? (image4 instanceof File ? URL.createObjectURL(image4) : image4) : assets.upload_area} alt="" />
            <input onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage4(f); }} type="file" id="edit-image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategoryId(e.target.value)} className='w-full px-3 py-2' value={categoryId} required>
            {categories.length === 0 && <option value="">No categories — create one first</option>}
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category (optional)</p>
          <select onChange={(e) => setSubCategoryId(e.target.value)} className='w-full px-3 py-2' value={subCategoryId}>
            <option value="">None</option>
            {subcategories.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' required />
        </div>
        <div>
          <p className='mb-2'>New Price (optional)</p>
          <input onChange={(e) => setNewPrice(e.target.value)} value={newPrice} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='Sale price' />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Colors (required)</p>
        <div className='flex flex-wrap gap-2 items-center'>
          <div className='flex items-center gap-2'>
            <input
              type="color"
              value={colorPickerValue}
              onChange={(e) => setColorPickerValue(e.target.value)}
              className='w-10 h-10 cursor-pointer border border-gray-300 rounded p-0.5 bg-white'
            />
            <button type="button" onClick={() => addColor(colorPickerValue)} className='px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded'>
              Add color
            </button>
          </div>
          {colors.map((hex) => (
            <span key={hex} className='inline-flex items-center gap-1'>
              <span
                className='w-5 h-5 rounded-full border border-gray-300 flex-shrink-0'
                style={{ backgroundColor: /^#/.test(hex) ? hex : '#9ca3af' }}
                title={hex}
              />
              <button type="button" onClick={() => removeColor(hex)} className='text-red-600 hover:text-red-700 text-sm'>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='edit-bestseller' />
          <label className='cursor-pointer' htmlFor="edit-bestseller">Add to bestseller</label>
        </div>
        <div className='flex gap-2'>
          <input onChange={() => setInStock(prev => !prev)} checked={inStock} type="checkbox" id='edit-inStock' />
          <label className='cursor-pointer' htmlFor="edit-inStock">In stock</label>
        </div>
      </div>

      <div className='flex gap-2 mt-4'>
        <button type="submit" className='w-28 py-3 bg-black text-white'>SAVE</button>
        <button type="button" onClick={() => navigate('/list')} className='w-28 py-3 bg-gray-300 text-gray-700'>Cancel</button>
      </div>
    </form>
  )
}

export default Edit
