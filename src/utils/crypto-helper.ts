import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/crypto.interfaces';
import env from './validate-env';

const SECRET: string = env.SECRET_KEY;

/** Function to encrypt data using JWT (JSON Web Token) */
const encrypt = (data: Record<string, unknown>) => {
    return jwt.sign(data, SECRET);
};

/** Function to decode a JWT token without verifying it */
const decrypt = (token: string): string | JwtPayload | null => {
    return jwt.decode(token);
};

/** Function to verify the validity of a JWT token */
const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET) as TokenPayload;
};

/** Asynchronous function to hash a password using bcrypt */
const hashAsync = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

/** Asynchronous function to compare a password with a hashed password using bcrypt */
const compareAsync = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash);
};

export default {
    encrypt,
    decrypt,
    verifyToken,
    hashAsync,
    compareAsync
};