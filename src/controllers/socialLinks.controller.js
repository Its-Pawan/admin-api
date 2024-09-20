import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SocialMediaLink } from "../models/socialLinks.model.js";
import { User } from "../models/user.model.js";

// Add a new social media link
const addSocialMediaLink = asyncHandler(async (req, res) => {
    const { platform, url } = req.body;


    if (!platform || !url) {
        throw new ApiError(400, "Platform and URL are required");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const socialMediaLink = await SocialMediaLink.create({
        platform,
        url,
        user: user._id
    });

    return res.status(201).json(
        new ApiResponse(201, socialMediaLink, "Social Media Link Added Successfully")
    );
});

// Get all social media links for the authenticated user
const getSocialMediaLinks = asyncHandler(async (req, res) => {

    const socialMediaLinks = await SocialMediaLink.find();
    if (!socialMediaLinks) {
        throw new ApiError(404, "No social links available")
    }

    return res.status(200).json(
        new ApiResponse(200, socialMediaLinks, "Social Media Links Retrieved Successfully")
    );
});

// Update a social media link by ID
const updateSocialMediaLink = asyncHandler(async (req, res) => {
    const { platform, url } = req.body;
    const { id } = req.params; 

    const socialMediaLink = await SocialMediaLink.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { platform, url },{ new: true, runValidators: true }
    );

    if (!socialMediaLink) {
        throw new ApiError(404, "Social Media Link not found or you are not authorized to update it");
    }

    return res.status(200).json(
        new ApiResponse(200, socialMediaLink, "Social Media Link Updated Successfully")
    );
});

// Delete a social media link by ID
const deleteSocialMediaLink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const socialMediaLink = await SocialMediaLink.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!socialMediaLink) {
        throw new ApiError(404, "Social Media Link not found or you are not authorized to delete it");
    } 

    return res.status(200).json(
        new ApiResponse(200, {}, "Social Media Link Deleted Successfully")
    );
});

export {
    addSocialMediaLink,
    getSocialMediaLinks,
    updateSocialMediaLink,
    deleteSocialMediaLink
};
