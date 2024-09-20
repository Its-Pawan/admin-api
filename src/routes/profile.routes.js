import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProfile, getMyProfiles, deleteProfile, updateProfile } from "../controllers/profile.controller.js";
const router = Router()

router.route('/create').post(
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), verifyJWT, createProfile
)
router.route('/update-profile').put(
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), verifyJWT, updateProfile
)

router.route('/:phone').get(getMyProfiles)
router.route('/deleteProfile').delete(verifyJWT, deleteProfile)

export default router