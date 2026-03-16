"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMediaFile = exports.assignmentMediaUpload = exports.communityPostMediaUpload = exports.lessonMediaUpload = exports.courseMediaUpload = exports.userProfileUpload = void 0;
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const uuid_1 = require("uuid");
// Create uploads folder if it doesn't exist
const userProfileDir = 'uploads/profiles';
const courseMediaDir = 'uploads/courses';
const lessonMediaDir = 'uploads/lessons';
const communityPostMediaDir = 'uploads/community-posts';
const assignmentMediaDir = 'uploads/assignments';
if (!(0, fs_1.existsSync)(userProfileDir)) {
    (0, fs_1.mkdirSync)(userProfileDir, { recursive: true });
}
if (!(0, fs_1.existsSync)(courseMediaDir)) {
    (0, fs_1.mkdirSync)(courseMediaDir, { recursive: true });
}
if (!(0, fs_1.existsSync)(lessonMediaDir)) {
    (0, fs_1.mkdirSync)(lessonMediaDir, { recursive: true });
}
if (!(0, fs_1.existsSync)(communityPostMediaDir)) {
    (0, fs_1.mkdirSync)(communityPostMediaDir, { recursive: true });
}
if (!(0, fs_1.existsSync)(assignmentMediaDir)) {
    (0, fs_1.mkdirSync)(assignmentMediaDir, { recursive: true });
}
// File name function
const fileNameFunction = (req, file, cb) => {
    const uniqueFileName = (0, uuid_1.v4)();
    const ext = (0, path_1.extname)(file.originalname);
    cb(null, uniqueFileName + ext);
};
// Multer storage config
const userProfileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, userProfileDir);
    },
    filename: (req, file, cb) => {
        fileNameFunction(req, file, cb);
    },
});
// Multer storage config for course media
const courseMediaStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, courseMediaDir);
    },
    filename: (req, file, cb) => {
        fileNameFunction(req, file, cb);
    },
});
// Multer storage config for lesson media
const lessonMediaStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, lessonMediaDir);
    },
    filename: (req, file, cb) => {
        fileNameFunction(req, file, cb);
    },
});
// Multer storage config for community post media
const communityPostMediaStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, communityPostMediaDir);
    },
    filename: (req, file, cb) => {
        fileNameFunction(req, file, cb);
    },
});
// Multer storage config for assignment media
const assignmentMediaStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, assignmentMediaDir);
    },
    filename: (req, file, cb) => {
        fileNameFunction(req, file, cb);
    },
});
exports.userProfileUpload = (0, multer_1.default)({
    storage: userProfileStorage,
});
exports.courseMediaUpload = (0, multer_1.default)({
    storage: courseMediaStorage,
});
exports.lessonMediaUpload = (0, multer_1.default)({
    storage: lessonMediaStorage,
});
exports.communityPostMediaUpload = (0, multer_1.default)({
    storage: communityPostMediaStorage,
});
exports.assignmentMediaUpload = (0, multer_1.default)({
    storage: assignmentMediaStorage,
});
/** Remove file from uploads folder */
const removeMediaFile = (mediaUrl) => {
    try {
        if (!mediaUrl)
            return {
                success: false,
                message: 'Media URL is required.'
            };
        // Extract filename from URL
        const filename = mediaUrl.split('/').pop();
        if (!filename)
            return {
                success: false,
                message: 'Unable to extract filename from media URL.'
            };
        // Get directory path based on URL segments
        const urlParts = mediaUrl.split('/');
        const folderName = urlParts[urlParts.length - 2]; // e.g. 'profiles'
        // Construct full file path
        const filePath = (0, path_1.join)(__dirname, `../../uploads/${folderName}/${filename}`);
        // Remove file if exists
        if ((0, fs_1.existsSync)(filePath)) {
            (0, fs_1.unlinkSync)(filePath);
        }
        return {
            success: true,
            message: 'Media file removed successfully.'
        };
    }
    catch (error) {
        console.log("Error removing media file:", error);
        return {
            success: false,
            message: error.message || 'Unable to remove media file.'
        };
    }
};
exports.removeMediaFile = removeMediaFile;
