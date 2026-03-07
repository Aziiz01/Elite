import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [selectedCatForSub, setSelectedCatForSub] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/category/list')
      if (res.data.success) {
        setCategories(res.data.categories || [])
        if (!selectedCatForSub && res.data.categories?.[0]) {
          setSelectedCatForSub(res.data.categories[0]._id)
        }
      }
    } catch (e) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      const res = await axios.post(backendUrl + '/api/category/create', { name: newCategoryName.trim() }, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        setNewCategoryName('')
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  const createSubcategory = async (e) => {
    e.preventDefault()
    if (!newSubName.trim() || !selectedCatForSub) return
    try {
      const res = await axios.post(backendUrl + '/api/category/subcategory/create', { name: newSubName.trim(), categoryId: selectedCatForSub }, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        setNewSubName('')
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  if (loading) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-semibold">Categories & Subcategories</h2>

      <div className="border border-gray-200 rounded p-4 max-w-md">
        <p className="mb-3 font-medium">Add Category</p>
        <form onSubmit={createCategory} className="flex gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Category name"
          />
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">Add</button>
        </form>
      </div>

      <div className="border border-gray-200 rounded p-4 max-w-md">
        <p className="mb-3 font-medium">Add Subcategory</p>
        <form onSubmit={createSubcategory} className="flex flex-col gap-2">
          <select
            value={selectedCatForSub}
            onChange={(e) => setSelectedCatForSub(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Subcategory name"
            />
            <button type="submit" className="px-4 py-2 bg-black text-white rounded">Add</button>
          </div>
        </form>
      </div>

      <div>
        <p className="mb-2 font-medium">Existing categories</p>
        <ul className="list-disc pl-5 text-gray-700">
          {categories.map((c) => (
            <li key={c._id}>{c.name}</li>
          ))}
          {categories.length === 0 && <li className="text-gray-500">None yet. Add one above or run: node scripts/seed-categories.js</li>}
        </ul>
      </div>
    </div>
  )
}

export default Categories
