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
exports.runSeeds = void 0;
const database_1 = require("../config/database");
const index_model_1 = require("../models/index.model");
const users_seeder_1 = require("./users.seeder");
const permissions_seeder_1 = require("./permissions.seeder");
const user_permissions_seeder_1 = require("./user-permissions.seeder");
// run all seeds
const runSeeds = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, users_seeder_1.seedUsers)(connection);
    yield (0, permissions_seeder_1.seedPermissions)(connection);
    yield (0, user_permissions_seeder_1.seedUserPermissions)(connection);
});
exports.runSeeds = runSeeds;
// Allow `npm run seed` to execute seeding directly
if (require.main === module) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        let sequelize;
        try {
            console.log('Initializing database connection for seeding...');
            sequelize = yield (0, database_1.initializeDatabase)();
            console.log('Initializing models for seeding...');
            (0, index_model_1.initMySQLModels)(sequelize);
            console.log('Synchronizing database...');
            yield sequelize.sync({ alter: true });
            console.log('Running seeders...');
            yield (0, exports.runSeeds)(sequelize);
            console.log('🌱 Seeding completed');
            yield sequelize.close();
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            if (sequelize)
                yield sequelize.close();
            process.exit(1);
        }
    }))();
}
