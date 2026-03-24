"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeds = void 0;
const database_1 = require("../config/database");
const index_model_1 = require("../models/index.model");
const users_seeder_1 = require("./users.seeder");
const permissions_seeder_1 = require("./permissions.seeder");
const user_permissions_seeder_1 = require("./user-permissions.seeder");
const categories_seeder_1 = require("./categories.seeder");
const jewellery_types_seeder_1 = require("./jewellery-types.seeder");
// run all seeds
const runSeeds = async (connection) => {
    await (0, users_seeder_1.seedUsers)(connection);
    await (0, permissions_seeder_1.seedPermissions)(connection);
    await (0, user_permissions_seeder_1.seedUserPermissions)(connection);
    await (0, categories_seeder_1.seedCategories)(connection);
    await (0, jewellery_types_seeder_1.seedJewelleryTypes)(connection);
};
exports.runSeeds = runSeeds;
// Allow `npm run seed` to execute seeding directly
if (require.main === module) {
    (async () => {
        let sequelize;
        try {
            console.log('Initializing database connection for seeding...');
            sequelize = await (0, database_1.initializeDatabase)();
            console.log('Initializing models for seeding...');
            (0, index_model_1.initMySQLModels)(sequelize);
            console.log('Synchronizing database...');
            await sequelize.sync({ alter: true });
            console.log('Running seeders...');
            await (0, exports.runSeeds)(sequelize);
            console.log('🌱 Seeding completed');
            await sequelize.close();
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            if (sequelize)
                await sequelize.close();
            process.exit(1);
        }
    })();
}
