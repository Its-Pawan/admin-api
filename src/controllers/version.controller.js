import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Version } from "../models/version.model.js";

// Create a new version
const createVersion = asyncHandler(async (req, res) => {
    const { versionNumber, heading, content } = req.body;


    if ([versionNumber, heading, content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    // Check if a version with the same versionNumber already exists
    const existingVersion = await Version.findOne({ versionNumber });
    if (existingVersion) {
        throw new ApiError(409, "Version with this number already exists");
    }

    const version = await Version.create({
        versionNumber,
        heading,
        content,
    });

    return res.status(201).json(
        new ApiResponse(201, version, "Version created successfully")
    );
});

// Get all versions
const getAllVersions = asyncHandler(async (req, res) => {
    const versions = await Version.find().sort({ date: -1 }); // Sort by date in descending order
    return res.status(200).json(
        new ApiResponse(200, versions, "Versions retrieved successfully")
    );
});

// Get a specific version by versionNumber
const getVersion = asyncHandler(async (req, res) => {
    const { versionNumber } = req.params;
    const version = await Version.findOne({ versionNumber });

    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    return res.status(200).json(
        new ApiResponse(200, version, "Version retrieved successfully")
    );
});

// Update a specific version by versionNumber
const updateVersion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { versionNumber, heading, content } = req.body;

    const version = await Version.findByIdAndUpdate(
        id ,
        { versionNumber, heading, content },
        { new: true, runValidators: true }
    );

    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    return res.status(200).json(
        new ApiResponse(200, version, "Version updated successfully")
    );
});

// Delete a specific version by versionNumber
const deleteVersion = asyncHandler(async (req, res) => {
    const { versionNumber } = req.params;

    const version = await Version.findOneAndDelete({ versionNumber });

    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Version deleted successfully")
    );
});

export { createVersion, getAllVersions, getVersion, updateVersion, deleteVersion };
