import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

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
          setCategoryId(res.data.categories[0]._id)
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
          setSubcategories(res.data.subcategories || [])
          setSubCategoryId("")
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

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      if (newPrice) formData.append("newPrice", newPrice)
      formData.append("categoryId", categoryId)
      if (subCategoryId) formData.append("subCategoryId", subCategoryId)
      formData.append("bestseller", bestseller)
      formData.append("inStock", inStock)
      formData.append("colors", JSON.stringify(colors))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setNewPrice('')
        setColors([])
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
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
                style={{ backgroundColor: hex }}
                title={hex}
              />
              <button type="button" onClick={() => removeColor(hex)} className='text-red-600 hover:text-red-700 text-sm'>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>
        <div className='flex gap-2'>
          <input onChange={() => setInStock(prev => !prev)} checked={inStock} type="checkbox" id='inStock' />
          <label className='cursor-pointer' htmlFor="inStock">In stock</label>
        </div>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
