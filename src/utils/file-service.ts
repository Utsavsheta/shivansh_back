import { Request } from 'express';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import multer from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RemoveMediaResponse } from '../interfaces/response.interfaces';

// Create uploads folder if it doesn't exist
const userProfileDir = 'uploads/profiles';
const categoryMediaDir = 'uploads/categories';

if(!existsSync(userProfileDir)) {
    mkdirSync(userProfileDir, { recursive: true });
}

if(!existsSync(categoryMediaDir)) {
  mkdirSync(categoryMediaDir, { recursive: true });
}

// File name function
const fileNameFunction = (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueFileName = uuidv4();
    const ext = extname(file.originalname);
    cb(null, uniqueFileName + ext);
};

// Multer storage config
const userProfileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, userProfileDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    fileNameFunction(req, file, cb);
  },
});

// Multer storage config for category media
const categoryMediaStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, categoryMediaDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    fileNameFunction(req, file, cb);
  },
});

export const userProfileUpload = multer({
    storage: userProfileStorage,
});

export const categoryMediaUpload = multer({
  storage: categoryMediaStorage,
});

/** Remove file from uploads folder */
export const removeMediaFile = (mediaUrl: string): RemoveMediaResponse => {
    try {
        if (!mediaUrl) return {
            success: false,
            message: 'Media URL is required.'
        };
        
        // Extract filename from URL
        const filename = mediaUrl.split('/').pop();
        if (!filename) return {
            success: false,
            message: 'Unable to extract filename from media URL.'
        };

        // Get directory path based on URL segments
        const urlParts = mediaUrl.split('/');
        const folderName = urlParts[urlParts.length - 2]; // e.g. 'profiles'
        
        // Construct full file path
        const filePath = join(__dirname, `../../uploads/${folderName}/${filename}`);

        // Remove file if exists
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }

        return {
            success: true,
            message: 'Media file removed successfully.'
        };
    } catch (error: any) {
        console.log("Error removing media file:", error);
        return {
            success: false,
            message: error.message || 'Unable to remove media file.'
        };
    }
};