import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState(null)
  const [newSubName, setNewSubName] = useState('')
  const [selectedCatForSub, setSelectedCatForSub] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editingSubId, setEditingSubId] = useState(null)
  const [editSubName, setEditSubName] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)

  const fetchCategories = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/category/list-with-subs')
      if (res.data.success) {
        setCategories(res.data.categories || [])
        if (!selectedCatForSub && res.data.categories?.[0]) {
          setSelectedCatForSub(res.data.categories[0]._id)
        }
      }
    } catch (e) {
      toast.error('Could not load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }
    try {
      const formData = new FormData()
      formData.append('name', newCategoryName.trim())
      if (newCategoryDescription.trim()) formData.append('description', newCategoryDescription.trim())
      if (newCategoryImage instanceof File) formData.append('image', newCategoryImage)

      const res = await axios.post(backendUrl + '/api/category/create', formData, { headers: { token } })
      if (res.data.success) {
        toast.success('Category added')
        setNewCategoryName('')
        setNewCategoryDescription('')
        setNewCategoryImage(null)
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat._id)
    setEditName(cat.name || '')
    setEditDescription(cat.description || '')
    setEditImage(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDescription('')
    setEditImage(null)
  }

  const updateCategory = async (e) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const formData = new FormData()
      formData.append('id', editingId)
      formData.append('name', editName.trim())
      formData.append('description', editDescription.trim())
      if (editImage instanceof File) formData.append('image', editImage)

      const res = await axios.post(backendUrl + '/api/category/update', formData, { headers: { token } })
      if (res.data.success) {
        toast.success('Category updated')
        cancelEdit()
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
    if (!newSubName.trim() || !selectedCatForSub) {
      toast.error('Please enter a subcategory name and select a category')
      return
    }
    try {
      const res = await axios.post(
        backendUrl + '/api/category/subcategory/create',
        { name: newSubName.trim(), categoryId: selectedCatForSub },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Subcategory added')
        setNewSubName('')
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  const startEditSub = (sub) => {
    setEditingSubId(sub._id)
    setEditSubName(sub.name || '')
  }

  const cancelEditSub = () => {
    setEditingSubId(null)
    setEditSubName('')
  }

  const updateSubcategory = async (e) => {
    e.preventDefault()
    if (!editingSubId) return
    try {
      const res = await axios.post(
        backendUrl + '/api/category/subcategory/update',
        { id: editingSubId, name: editSubName.trim() },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Subcategory updated')
        cancelEditSub()
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  const deleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
    try {
      const res = await axios.post(backendUrl + '/api/category/delete', { id: cat._id }, { headers: { token } })
      if (res.data.success) {
        toast.success('Category deleted')
        setExpandedCategory(null)
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  const deleteSubcategory = async (subId) => {
    if (!window.confirm('Delete this subcategory? This cannot be undone.')) return
    try {
      const res = await axios.post(
        backendUrl + '/api/category/subcategory/delete',
        { id: subId },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Subcategory deleted')
        fetchCategories()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message)
    }
  }

  if (loading) {
    return <p className="text-gray-600">Loading categories...</p>
  }

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categories & Subcategories</h1>
      <p className="text-gray-600 mb-8">
        Organize your products with categories (e.g. Lèvres, Teint) and subcategories (e.g. Gloss, Poudres).
      </p>

      {/* Add forms in a clean card */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a category</h2>
          <form onSubmit={createCategory} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="e.g. Lèvres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                placeholder="Short description shown on the storefront"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <img
                  className="w-20 h-20 object-cover rounded mb-2"
                  src={newCategoryImage ? URL.createObjectURL(newCategoryImage) : assets.upload_area}
                  alt=""
                />
                <span className="text-sm text-gray-500">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCategoryImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 w-fit">
              Add category
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a subcategory</h2>
          <form onSubmit={createSubcategory} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Under which category?</label>
              <select
                value={selectedCatForSub}
                onChange={(e) => setSelectedCatForSub(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {categories.length === 0 && <option value="">No categories yet</option>}
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory name</label>
              <div className="flex gap-2">
                <input
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="e.g. Gloss"
                />
                <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 shrink-0">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Your categories */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your categories</h2>
      <p className="text-gray-600 mb-6">
        {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
      </p>

      {categories.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-2">No categories yet.</p>
          <p className="text-sm text-gray-500">Add your first category using the form above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedCategory(expandedCategory === c._id ? null : c._id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <img
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                  src={c.image || assets.upload_area}
                  alt={c.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-500">
                    {(c.subcategories || []).length} subcategor{(c.subcategories || []).length !== 1 ? 'ies' : 'y'}
                    {c.description && ' · Has description'}
                  </p>
                </div>
                <span className="text-gray-400">{expandedCategory === c._id ? '▲' : '▼'}</span>
              </button>

              {expandedCategory === c._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {editingId === c._id ? (
                    <form onSubmit={updateCategory} className="flex flex-col gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Category name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                          placeholder="Short description shown on the storefront"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-white">
                          <img
                            className="w-16 h-16 object-cover rounded mb-2"
                            src={editImage ? URL.createObjectURL(editImage) : (c.image || assets.upload_area)}
                            alt=""
                          />
                          <span className="text-sm text-gray-500">Click to change</span>
                          <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files?.[0] || null)} className="hidden" />
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium">
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm"
                      >
                        Edit category
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(c)}
                        disabled={(c.subcategories || []).length > 0}
                        title={(c.subcategories || []).length > 0 ? 'Delete all subcategories first' : 'Delete this category'}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        Delete category
                      </button>
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 mb-3">Subcategories</p>
                  {(c.subcategories || []).length === 0 ? (
                    <p className="text-sm text-gray-500">No subcategories. Add one above.</p>
                  ) : (
                    <ul className="space-y-2">
                      {(c.subcategories || []).map((s) => (
                        <li
                          key={s._id}
                          className="flex items-center justify-between gap-2 bg-white rounded-lg px-4 py-3 border border-gray-100"
                        >
                          {editingSubId === s._id ? (
                            <form onSubmit={updateSubcategory} className="flex gap-2 flex-1">
                              <input
                                value={editSubName}
                                onChange={(e) => setEditSubName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Name"
                                autoFocus
                              />
                              <button type="submit" className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium">
                                Save
                              </button>
                              <button type="button" onClick={cancelEditSub} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <span className="font-medium text-gray-800">{s.name}</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditSub(s)}
                                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSubcategory(s._id)}
                                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories
