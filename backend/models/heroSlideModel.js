import mongoose from 'mongoose'

const heroSlideSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ['image', 'video'] },
    src: { type: String, required: true, trim: true },
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
    ctaLabel: { type: String, default: 'Shop Now', trim: true },
    ctaTo: { type: String, default: '/collection', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const HeroSlideModel = mongoose.models.heroslide || mongoose.model('heroslide', heroSlideSchema)
export default HeroSlideModel
