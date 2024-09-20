import mongoose, { Schema } from "mongoose";

const socialMediaLinkSchema = new  Schema({
    platform: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);

