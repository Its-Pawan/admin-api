import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        default: function () {
            return slugify(this.projectName, { lower: true, strict: true });
        }
    },
    shortDescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String], // Array of strings
        // required: true,
    },
    projectThumbnail: {
        type: String,
        required: true,
    },
    projectLink: {
        type: String,
        lowercase: true
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

// Pre-save hook to generate the slug from the title
projectSchema.pre('validate', function (next) {
    if (this.projectName && !this.slug) {
        this.slug = slugify(this.projectName, { lower: true, strict: true });
    }
    next();
});


export const Project = mongoose.model("Project", projectSchema)