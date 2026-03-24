"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_media_model_1 = require("../models/user-media.model");
/** Save user profile picture */
const saveUserProfilePicture = async (userId, file, transaction) => {
    await user_media_model_1.UserMedia.create({
        user_id: userId,
        filename: file.originalname,
        extension: file.mimetype,
        filesize: file.size,
        sys_filename: file.filename,
    }, {
        transaction: transaction,
    });
};
/** Update user profile picture */
const updateUserProfilePicture = async (userId, file, transaction) => {
    await user_media_model_1.UserMedia.update({
        filename: file.originalname,
        extension: file.mimetype,
        filesize: file.size,
        sys_filename: file.filename,
    }, {
        where: {
            user_id: userId,
        },
        transaction: transaction,
    });
};
exports.default = {
    saveUserProfilePicture,
    updateUserProfilePicture
};
