import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        default: function () {
            return slugify(this.title, { lower: true, strict: true });
        }
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Pre-save hook to generate the slug from the title
blogSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});


export const Blog = mongoose.model("Blog", blogSchema)