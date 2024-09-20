import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
    versionNumber: {
        type: String,
        required: true,
        unique: true,
    },
    heading: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Version = mongoose.model('Version', versionSchema);

export { Version };
