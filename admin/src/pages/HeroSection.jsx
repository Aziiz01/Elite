import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const HeroSection = ({ token }) => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    ctaLabel: '',
    ctaTo: '',
    media: null
  })
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/hero/list')
      setSlides(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to load hero slides')
      setSlides([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      subtitle: '',
      ctaLabel: '',
      ctaTo: '',
      media: null
    })
    setEditingId(null)
    setShowForm(false)
    setUploadProgress(null)
  }

  const openAdd = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (slide) => {
    setEditingId(slide._id)
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      ctaLabel: slide.ctaLabel || '',
      ctaTo: slide.ctaTo || '',
      media: null
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editingId && !form.media) {
      toast.error('Please upload an image or video')
      return
    }

    try {
      setSaving(true)
      setUploadProgress(0)
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subtitle', form.subtitle)
      fd.append('ctaLabel', form.ctaLabel)
      fd.append('ctaTo', form.ctaTo)
      if (form.media) fd.append('media', form.media)

      const onProgress = (e) => {
        const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0
        setUploadProgress(pct)
      }

      if (editingId) {
        const res = await axios.post(
          backendUrl + `/api/hero/update/${editingId}`,
          fd,
          { headers: { token }, onUploadProgress: onProgress }
        )
        if (res.data.success) {
          toast.success('Slide updated')
          resetForm()
          fetchSlides()
        } else {
          toast.error(res.data.message || 'Update failed')
        }
      } else {
        const res = await axios.post(backendUrl + '/api/hero/add', fd, {
          headers: { token },
          onUploadProgress: onProgress
        })
        if (res.data.success) {
          toast.success('Slide added')
          resetForm()
          fetchSlides()
        } else {
          toast.error(res.data.message || 'Add failed')
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to save'
      )
    } finally {
      setSaving(false)
      setUploadProgress(null)
    }
  }

  const handleRemove = async (slide) => {
    if (!window.confirm(`Delete slide "${slide.title || 'Untitled'}"?`)) return
    try {
      const res = await axios.post(
        backendUrl + `/api/hero/remove/${slide._id}`,
        {},
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Slide deleted')
        fetchSlides()
      } else {
        toast.error(res.data.message || 'Delete failed')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to delete'
      )
    }
  }

  const moveSlide = async (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= slides.length) return

    const reordered = [...slides]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]

    const orderPayload = reordered.map((s, i) => ({ id: s._id, order: i }))

    try {
      const res = await axios.post(
        backendUrl + '/api/hero/reorder',
        { order: orderPayload },
        { headers: { token } }
      )
      if (res.data.success) {
        setSlides(res.data.slides || reordered)
        toast.success('Order updated')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to reorder'
      )
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          <img className="w-4 h-4" src={assets.add_icon} alt="" />
          Add Slide
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : slides.length === 0 && !showForm ? (
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No hero slides yet. Add your first slide to customize the homepage hero carousel.</p>
          <button
            type="button"
            onClick={openAdd}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide._id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === slides.length - 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  ↓
                </button>
              </div>
              <div className="w-24 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {slide.type === 'video' ? (
                  <video
                    src={slide.src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{slide.title || 'Untitled'}</p>
                <p className="text-sm text-gray-500 truncate">{slide.subtitle || '—'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                  {slide.type}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(slide)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(slide)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Slide' : 'Add Slide'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image or Video {editingId && '(optional – leave blank to keep current)'}
                </label>
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 text-center">
                  <img
                    className="w-20 h-20 mx-auto object-contain"
                    src={
                      form.media
                        ? URL.createObjectURL(form.media)
                        : assets.upload_area
                    }
                    alt=""
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, media: e.target.files[0] || null }))
                    }
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Images: jpeg, png, webp. Videos: mp4, webm (max 50MB)
                  </p>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. New Season Essentials"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g. Elevated fashion and beauty picks."
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label (optional – leave blank to hide button)</label>
                <input
                  type="text"
                  value={form.ctaLabel}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link (optional – required if CTA label is set)</label>
                <input
                  type="text"
                  value={form.ctaTo}
                  onChange={(e) => setForm((f) => ({ ...f, ctaTo: e.target.value }))}
                  placeholder="e.g. /collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {uploadProgress != null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroSection
