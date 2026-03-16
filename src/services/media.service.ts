import { Transaction } from "sequelize";
import { UserMedia } from "../models/user-media.model";

/** Save user profile picture */
const saveUserProfilePicture = async (userId: string, file: Express.Multer.File, transaction: Transaction) => {
    await UserMedia.create({
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
const updateUserProfilePicture = async (userId: string, file: Express.Multer.File, transaction: Transaction) => {
    await UserMedia.update({
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


export default {
    saveUserProfilePicture,
    updateUserProfilePicture
};