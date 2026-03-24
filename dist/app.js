"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
        // Middlewares
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(express_1.default.json({ limit: '200mb' }));
        this.express.use(express_1.default.urlencoded({ extended: true, limit: '200mb' }));
        this.express.use((0, cors_1.default)({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
        }));
        // Serve static files (uploaded images)
        this.express.use('/media', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
        // Routes
        this.express.use('/api', index_routes_1.default);
        // Route to check if server is working or not
        this.express.get('/', (req, res) => {
            res.send('Server Works! 🚀🚀 ');
        });
        this.express.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });
        });
        this.express.use(error_middleware_1.errorMiddleware);
        // If no route is matched
        this.express.use((req, res) => {
            res.status(404).send('Endpoint not found!');
        });
    }
}
exports.App = App;
