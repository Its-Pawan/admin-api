import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/profile.model.js"
import { User } from "../models/user.model.js";

const createProfile = asyncHandler(async (req, res) => {
    const { name, about, phone, altPhone, email, location, dob } = req.body
    if ([name, about, phone, altPhone, email, location, dob].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    // Check if the user already has a profile
    const existingProfile = await Profile.findOne({ owner: req.user.id });
    if (existingProfile) {
        throw new ApiError(409, "You have already created a profile");
    }

    const extractImagePath = (fileField) => {
        if (req.files && Array.isArray(req.files[fileField]) && req.files[fileField].length > 0) {
            return req.files[fileField][0].path;
        }
        throw new ApiError(400, `${fileField} is required`);
    };

    let profileImageLocalPath = extractImagePath('profileImage');
    let coverImageLocalPath = extractImagePath('coverImage');

    // Uploading images to Cloudinary
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isProfileAvailable = await Profile.findOne({ email })
    if (isProfileAvailable) {
        throw new ApiError(409, "A profile with this email already exists")
    }

    const profile = await Profile.create({
        name,
        profileImage: profileImage.url,
        coverImage: coverImage.url,
        about,
        phone,
        altPhone,
        email,
        location,
        dob,
        owner: user._id,
    })

    const createdProfile = await Profile.findById(profile._id)
    if (!createdProfile) {
        throw new ApiError(500, "Something went wrong while creating a profile")
    }


    return res.status(201).json(
        new ApiResponse(201, createdProfile, "Profile Created Successfully")
    )
})

const getMyProfiles = asyncHandler(async (req, res) => {
    const {phone} = req.params 
    const profiles = await Profile.find({ phone});
    if (!profiles || profiles.length === 0) {
        throw new ApiError(404, "No profiles found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, profiles, "Profiles found")
    );
});

const deleteProfile = asyncHandler(async (req, res) => {

    const profile = await Profile.findOneAndDelete({ owner: req.user.id });
    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Profile deleted successfully")
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, about, phone, altPhone, email, location, dob } = req.body;

    // Find the profile associated with the authenticated user
    const profile = await Profile.findOne({ owner: req.user.id });

    // If no profile is found, return a 404 error
    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    // Check if the user is trying to update the profile image
    if (req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0) {
        const profileImageLocalPath = req.files.profileImage[0].path;
        const profileImage = await uploadOnCloudinary(profileImageLocalPath);
        profile.profileImage = profileImage.url;
    }

    // Check if the user is trying to update the cover image
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        const coverImageLocalPath = req.files.coverImage[0].path;
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        profile.coverImage = coverImage.url;
    }

    // Update the profile with the new data
    profile.name = name || profile.name;
    profile.about = about || profile.about;
    profile.phone = phone || profile.phone;
    profile.altPhone = altPhone || profile.altPhone;
    profile.email = email || profile.email;
    profile.location = location || profile.location;
    profile.dob = dob || profile.dob;

    // Save the updated profile
    const updatedProfile = await profile.save();

    return res.status(200).json(
        new ApiResponse(200, updatedProfile, "Profile updated successfully")
    );
});

export { createProfile, getMyProfiles, deleteProfile, updateProfile }