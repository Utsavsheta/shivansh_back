"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_media_model_1 = require("../models/user-media.model");
/** Save user profile picture */
const saveUserProfilePicture = (userId, file, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_media_model_1.UserMedia.create({
        user_id: userId,
        filename: file.originalname,
        extension: file.mimetype,
        filesize: file.size,
        sys_filename: file.filename,
    }, {
        transaction: transaction,
    });
});
/** Update user profile picture */
const updateUserProfilePicture = (userId, file, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_media_model_1.UserMedia.update({
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
});
exports.default = {
    saveUserProfilePicture,
    updateUserProfilePicture
};
