import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createVersion, getAllVersions, getVersion, updateVersion, deleteVersion } from "../controllers/version.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// router.post('/add-new', verifyJWT, createVersion);
router.post('/add-new',
    upload.fields([]), verifyJWT, createVersion
);
router.get('/', getAllVersions);
router.get('/:versionNumber', getVersion);
router.patch('/update/:id',
    upload.fields([]), verifyJWT, updateVersion);
router.delete('/delete/:versionNumber', verifyJWT, deleteVersion);

export default router