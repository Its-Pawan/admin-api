import { Router } from "express";
import { addSocialMediaLink, getSocialMediaLinks, updateSocialMediaLink, deleteSocialMediaLink } from "../controllers/socialLinks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/add-new-plateform").post(
    upload.fields([]), verifyJWT, addSocialMediaLink
)
router.route("/").get(getSocialMediaLinks)

router.route("/update/:id").patch(
    upload.fields([]), verifyJWT, updateSocialMediaLink
)
router.route("/delete/:id").delete(verifyJWT, deleteSocialMediaLink);


export default router