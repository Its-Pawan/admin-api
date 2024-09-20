import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js"
import slugify from "slugify"
import { User } from "../models/user.model.js";

const addProject = asyncHandler(async (req, res) => {
    const { projectName, shortDescription, projectLink, techStack, description } = req.body
    if ([projectName, shortDescription, projectLink, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    let projectThumbnailLocalPath;
    if (req.files && Array.isArray(req.files.projectThumbnail) && req.files.projectThumbnail.length > 0) {
        projectThumbnailLocalPath = req.files.projectThumbnail[0].path
    }
    if (!projectThumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }
    const projectThumbnail = await uploadOnCloudinary(projectThumbnailLocalPath)

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const project = await Project.create({
        projectName,
        projectThumbnail: projectThumbnail.url,
        description,
        shortDescription,
        techStack,
        projectLink,
        owner: user._id
    })

    const addProject = await Project.findById(project._id);
    if (!addProject) {
        throw new ApiError(500, "Something went wrong while storing blog")
    }

    return res.status(201).json(
        new ApiResponse(201, addProject, "Project Added Successfully")
    )
})

const getAllProjects = asyncHandler(async (req, res) => {
    const sortBy = req.query.sortBy || 'publishDate';
    const order = req.query.order === 'asc' ? 1 : -1;

    const projects = await Project.find().sort({ [sortBy]: order })
    if (!projects) {
        throw new ApiError(404, "No projects found")
    }
    return res.status(201).json(new ApiResponse(201, projects, "All projects fetched successfully"))
})

const deleteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleteSingleProject = await Project.findOneAndDelete({ _id: id });
    if (!deleteSingleProject) {
        throw new ApiError(404, `Project with id ${id} was not found`);
    }

    return res.status(200).json(new ApiResponse(200, { deleteSingleProject }, `Project with id ${id} deleted successfully`));
})

const findProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params

    const foundProject = await Project.findOne({ slug })
    if (!foundProject) {
        throw new ApiError(404, `This project was not find`)
    }
    return res.status(200).json(new ApiResponse(200, { foundProject }, 'Project found successfully'))
})

const updateProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { projectName, shortDescription, projectLink, techStack, description } = req.body;

    if ([projectName, shortDescription, projectLink, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let projectThumbnailLocalPath;
    if (req.files && Array.isArray(req.files.projectThumbnail) && req.files.projectThumbnail.length > 0) {
        projectThumbnailLocalPath = req.files.projectThumbnail[0].path;
    }
    if (!projectThumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }
    const projectThumbnail = await uploadOnCloudinary(projectThumbnailLocalPath);

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedFields = {
        projectName,
        shortDescription,
        projectLink,
        techStack,
        description,
        ...(projectThumbnail && { projectThumbnail: projectThumbnail.url }),
    };

    if (projectName) {
        updatedFields.slug = slugify(projectName, { lower: true, strict: true });
    }

    const updatedProject = await Project.findOneAndUpdate(
        { slug, owner: user._id },
        updatedFields,
        { new: true, runValidators: true }
    );

    if (!updatedProject) {
        throw new ApiError(404, "Project not found or you are not authorized to update this project");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project Updated Successfully")
    );
});


export { addProject, getAllProjects, deleteById, findProjectBySlug, updateProjectBySlug }