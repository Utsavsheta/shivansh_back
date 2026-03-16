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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const user_model_1 = require("../models/user.model");
const constants_1 = require("./constants");
const crypto_helper_1 = __importDefault(require("../utils/crypto-helper"));
const seedUsers = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield connection.transaction();
    try {
        // Check if users already exist
        const existingUsersCount = yield user_model_1.User.count({ transaction });
        if (existingUsersCount > 0) {
            console.log(`Users already exist (${existingUsersCount} records). Skipping user seeding.`);
            yield transaction.commit();
            return;
        }
        console.log('No users found. Starting user seeding...');
        // Prepare user data with hashed passwords
        const usersToSeed = yield Promise.all(constants_1.DEFAULT_USERS.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const hashed = yield crypto_helper_1.default.hashAsync(user.password);
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: hashed,
                role: user.role,
                is_deleted: user.is_deleted,
            };
        })));
        // Bulk create with updateOnDuplicate
        yield user_model_1.User.bulkCreate(usersToSeed, {
            transaction,
            updateOnDuplicate: ['name', 'email', 'password', 'role', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${constants_1.DEFAULT_USERS.length} users successfully`);
        yield transaction.commit();
    }
    catch (error) {
        yield transaction.rollback();
        console.log("Error seeding users: ", error);
        throw error;
    }
});
exports.seedUsers = seedUsers;
