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
exports.databaseConfiguration = exports.getDatabaseConfig = exports.initializeDatabase = exports.createSequelizeInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const validate_env_1 = __importDefault(require("../utils/validate-env"));
// Get database configuration
const environment = validate_env_1.default.NODE_ENV;
const databaseConfiguration = config_1.config[environment];
exports.databaseConfiguration = databaseConfiguration;
// Create database configuration without database name (for creating database)
const dbConfigurationWithoutDatabase = Object.assign(Object.assign({}, databaseConfiguration), { database: undefined });
// Create database configuration with database name (for normal operations)
const dbConfigurationWithDatabase = Object.assign({}, databaseConfiguration);
/**
 * Create a new Sequelize instance for database operations
 * @param includeDatabase - Whether to include the database name in the configuration
 * @returns Sequelize instance
 */
const createSequelizeInstance = (includeDatabase = true) => {
    const configuration = includeDatabase ? dbConfigurationWithDatabase : dbConfigurationWithoutDatabase;
    return new sequelize_1.Sequelize(configuration);
};
exports.createSequelizeInstance = createSequelizeInstance;
/**
 * Initialize database connection and create database if it doesn't exist
 * @returns Promise<Sequelize> - Connected Sequelize instance
 */
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create instance without database name to create database
        const sequelizeWithoutDB = (0, exports.createSequelizeInstance)(false);
        // Create database if it doesn't exist
        yield sequelizeWithoutDB.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfiguration.database}\`;`);
        yield sequelizeWithoutDB.close();
        // Create instance with database name
        const sequelize = (0, exports.createSequelizeInstance)(true);
        // Test connection
        yield sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return sequelize;
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
/**
 * Get database configuration for reference
 */
const getDatabaseConfig = () => ({
    host: databaseConfiguration.host,
    port: databaseConfiguration.port,
    username: databaseConfiguration.username,
    database: databaseConfiguration.database,
    dialect: databaseConfiguration.dialect
});
exports.getDatabaseConfig = getDatabaseConfig;
