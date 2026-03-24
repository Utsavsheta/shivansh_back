"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
require("dotenv/config");
const http_1 = require("http");
const app_1 = require("./app");
const database_1 = require("./config/database");
const index_model_1 = require("./models/index.model");
const index_seeder_1 = require("./seeders/index.seeder");
const validate_env_1 = __importDefault(require("./utils/validate-env"));
const app = new app_1.App();
const port = process.env.PORT || 5005;
console.log('port: ', port);
// Create HTTP server
const httpServer = (0, http_1.createServer)(app.express);
(async () => {
    try {
        // Initialize database connection
        console.log('Initializing database connection...');
        exports.sequelize = await (0, database_1.initializeDatabase)();
        // Initialize models
        console.log('Initializing models...');
        (0, index_model_1.initMySQLModels)(exports.sequelize);
        // Run alter operation safely
        console.log('Running alter operation...');
        await exports.sequelize.sync({ alter: true });
        console.log('✅ Sequelize OK - Database synchronized successfully');
        // Optionally run seeders
        if (validate_env_1.default.SEED === true) {
            await (0, index_seeder_1.runSeeds)(exports.sequelize);
            console.log('🌱 Seeding completed');
        }
        // Start the server
        httpServer.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error('❌ Error initializing server:', err);
        console.error('Unable to connect to the database.');
        process.exit(1); // Exit with failure
    }
})();
