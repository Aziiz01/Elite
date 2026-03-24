import { Router } from 'express'
import { list, add, update, remove, reorder } from '../controllers/heroController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multerHero.js'

const router = Router()

router.get('/list', list)
router.post('/add', adminAuth, upload.fields([{ name: 'media', maxCount: 1 }]), add)
router.post('/update/:id', adminAuth, upload.fields([{ name: 'media', maxCount: 1 }]), update)
router.post('/remove/:id', adminAuth, remove)
router.post('/reorder', adminAuth, reorder)

export default router
