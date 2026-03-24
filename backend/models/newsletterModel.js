import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
)

newsletterSchema.index({ email: 1 }, { unique: true })

const NewsletterModel = mongoose.models.newsletter || mongoose.model('newsletter', newsletterSchema)
export default NewsletterModel
