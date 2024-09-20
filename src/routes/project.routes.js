import { Router } from "express";
import { addProject, deleteById, findProjectBySlug, getAllProjects, updateProjectBySlug } from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/add-project").post(
    upload.fields([{
        name: "projectThumbnail",
        maxCount: 1
    }]), verifyJWT, addProject
)
router.route("/").get(getAllProjects)
router.route("/delete/:id").delete(deleteById);
router.route("/:slug").get(findProjectBySlug); 

router.route("/update/:slug").patch(upload.fields([{
    name: "thumbnail",
    maxCount: 1
}]), verifyJWT, updateProjectBySlug)


export default router