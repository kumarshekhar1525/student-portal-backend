const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema(
    {
        fileName: String,
        filePath: String,
        fileSize: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        mimeType: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('UploadLog', uploadLogSchema);
