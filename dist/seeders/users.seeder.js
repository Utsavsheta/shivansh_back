"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const user_model_1 = require("../models/user.model");
const constants_1 = require("./constants");
const crypto_helper_1 = __importDefault(require("../utils/crypto-helper"));
const seedUsers = async (connection) => {
    const transaction = await connection.transaction();
    try {
        // Check if users already exist
        const existingUsersCount = await user_model_1.User.count({ transaction });
        if (existingUsersCount > 0) {
            console.log(`Users already exist (${existingUsersCount} records). Skipping user seeding.`);
            await transaction.commit();
            return;
        }
        console.log('No users found. Starting user seeding...');
        // Prepare user data with hashed passwords
        const usersToSeed = await Promise.all(constants_1.DEFAULT_USERS.map(async (user) => {
            const hashed = await crypto_helper_1.default.hashAsync(user.password);
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: hashed,
                role: user.role,
                is_deleted: user.is_deleted,
            };
        }));
        // Bulk create with updateOnDuplicate
        await user_model_1.User.bulkCreate(usersToSeed, {
            transaction,
            updateOnDuplicate: ['name', 'email', 'password', 'role', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${constants_1.DEFAULT_USERS.length} users successfully`);
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.log("Error seeding users: ", error);
        throw error;
    }
};
exports.seedUsers = seedUsers;
