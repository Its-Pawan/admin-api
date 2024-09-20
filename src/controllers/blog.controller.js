import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js"
import slugify from "slugify"
import { User } from "../models/user.model.js";


const createBlog = asyncHandler(async (req, res) => { 

    const { title, description, content } = req.body

    if ([title, description, content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)


    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const blog = await Blog.create({
        title,
        thumbnail: thumbnail.url,
        description,
        content,
        owner: user._id,
        author: user.username
    })
    const createdBlog = await Blog.findById(blog._id);
    if (!createdBlog) {
        throw new ApiError(500, "Something went wrong while storing blog")
    }

    return res.status(201).json(
        new ApiResponse(201, createdBlog, "Blog Created Successfully")
    )
})

const getBlogBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const selectedBlog = await Blog.findOne({ slug });
    if (!selectedBlog) {
        throw new ApiError(404, "Blog not found");
    }
    return res.status(200).json(new ApiResponse(200, { selectedBlog }, `URL: ${slug}`));
})

const getAllBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional: Handle sorting (e.g., by publishDate, newest first)
    const sortBy = req.query.sortBy || 'createdAt'; 
    const order = req.query.order === 'asc' ? 1 : -1; 

    // Optional: Filtering (e.g., by owner, category, or other criteria)
    const filter = req.query.filter || {};

    // Fetch all blogs with pagination, sorting, and filtering
    const blogs = await Blog.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);

    // Count total number of blogs for pagination purposes
    const totalBlogs = await Blog.countDocuments(filter);

    // Return the blogs along with pagination info
    return res.status(200).json(new ApiResponse(
        200, {
        page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
        blogs
    }, "Fetched all blogs "
    ));
})

const updateBlog = asyncHandler(async (req, res) => {
    const { slug } = req.params; // Assume we're updating by slug
    const { title, description, content } = req.body;

    // Check if the fields are empty
    if ([title, description, content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Find the blog post by slug
    const blog = await Blog.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    // If there's a new thumbnail, upload it to Cloudinary
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        const thumbnailLocalPath = req.files.thumbnail[0].path;
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        blog.thumbnail = thumbnail.url; // Update the thumbnail URL
    }

    // Update the other fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;

    // If the title has changed, regenerate the slug
    if (title) {
        blog.slug = slugify(title, { lower: true, strict: true });
    }

    // Save the updated blog post
    const updatedBlog = await blog.save();

    // Return the updated blog post
    return res.status(200).json(new ApiResponse(200, {
        blog: updatedBlog
    }, "Blog updated successfully"));
}) 
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const deleteSingleBlog = await Blog.findOneAndDelete({ _id: id });
    if (!deleteSingleBlog) {
        throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(new ApiResponse(200, { deleteSingleBlog }, "Blog deleted successfully"));
})
export { createBlog, getBlogBySlug, getAllBlogs, updateBlog, deleteBlog }