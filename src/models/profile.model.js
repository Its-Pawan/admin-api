import mongoose, { Schema } from "mongoose"; 
const profileShema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    about: {
        type: String,
        required: true,
    }, 
    profileImage: {
        type: String,
        required:true,
    },
    coverImage: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    altPhone: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});
 


export const Profile = mongoose.model("Profile", profileShema)