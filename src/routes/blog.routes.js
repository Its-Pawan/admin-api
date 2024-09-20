import { Router } from "express";
import { createBlog, getAllBlogs, updateBlog, getBlogBySlug, deleteBlog } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/create-blog").post(
    upload.fields([{
        name: "thumbnail",
        maxCount: 1
    }]), verifyJWT, createBlog
)

router.route("/:slug").get(getBlogBySlug);
router.route("/").get(getAllBlogs)
router.route("/update/:slug").post(upload.fields([{
    name: "thumbnail",
    maxCount: 1
}]), verifyJWT, updateBlog)
router.route("/delete-blog/:id").get(verifyJWT, deleteBlog);

export default router