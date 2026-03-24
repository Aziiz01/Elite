import { v2 as cloudinary } from 'cloudinary'
import HeroSlideModel from '../models/heroSlideModel.js'

const resourceType = (mimetype) => {
  const video = ['video/mp4', 'video/webm']
  return video.includes(mimetype) ? 'video' : 'image'
}

export const list = async (req, res) => {
  try {
    const slides = await HeroSlideModel.find({}).sort({ order: 1 }).lean()
    return res.json(slides)
  } catch (error) {
    console.error('Hero list error:', error)
    return res.status(500).json({ error: 'Failed to fetch hero slides' })
  }
}

export const add = async (req, res) => {
  try {
    const { title, subtitle, ctaLabel, ctaTo, type } = req.body
    const file = req.files?.media?.[0]

    if (!file) {
      return res.status(400).json({ success: false, message: 'Image or video file is required' })
    }

    const rt = resourceType(file.mimetype)
    const maxOrder = await HeroSlideModel.findOne().sort({ order: -1 }).select('order').lean()
    const nextOrder = (maxOrder?.order ?? -1) + 1

    const result = await cloudinary.uploader.upload(file.path, { resource_type: rt })
    const src = result.secure_url

    const slide = await HeroSlideModel.create({
      type: rt,
      src,
      title: (title || '').trim(),
      subtitle: (subtitle || '').trim(),
      ctaLabel: (ctaLabel || '').trim(),
      ctaTo: (ctaTo || '').trim(),
      order: nextOrder,
    })

    return res.status(201).json({ success: true, slide })
  } catch (error) {
    console.error('Hero add error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Failed to add slide' })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { title, subtitle, ctaLabel, ctaTo } = req.body
    const file = req.files?.media?.[0]

    const slide = await HeroSlideModel.findById(id)
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' })
    }

    let src = slide.src
    if (file) {
      const rt = resourceType(file.mimetype)
      const result = await cloudinary.uploader.upload(file.path, { resource_type: rt })
      src = result.secure_url
    }

    slide.type = file ? resourceType(file.mimetype) : slide.type
    slide.src = src
    if (title !== undefined) slide.title = (title || '').trim()
    if (subtitle !== undefined) slide.subtitle = (subtitle || '').trim()
    if (ctaLabel !== undefined) slide.ctaLabel = (ctaLabel || '').trim()
    if (ctaTo !== undefined) slide.ctaTo = (ctaTo || '').trim()
    await slide.save()

    return res.json({ success: true, slide })
  } catch (error) {
    console.error('Hero update error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Failed to update slide' })
  }
}

export const remove = async (req, res) => {
  try {
    const { id } = req.params
    const slide = await HeroSlideModel.findByIdAndDelete(id)
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' })
    }
    return res.json({ success: true, message: 'Slide deleted' })
  } catch (error) {
    console.error('Hero remove error:', error)
    return res.status(500).json({ success: false, message: 'Failed to delete slide' })
  }
}

export const reorder = async (req, res) => {
  try {
    const { order } = req.body
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ success: false, message: 'Order array is required' })
    }

    await Promise.all(
      order.map(({ id, order: o }) => HeroSlideModel.findByIdAndUpdate(id, { order: o }))
    )

    const slides = await HeroSlideModel.find({}).sort({ order: 1 }).lean()
    return res.json({ success: true, slides })
  } catch (error) {
    console.error('Hero reorder error:', error)
    return res.status(500).json({ success: false, message: 'Failed to reorder slides' })
  }
}
