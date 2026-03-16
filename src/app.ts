import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import path from 'path';

export class App {
    public express: Express = express();
    
    constructor() {
        // Middlewares
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json({ limit: '200mb' }));
        this.express.use(express.urlencoded({ extended: true, limit: '200mb' }));
        this.express.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
        }));
        
        // Serve static files (uploaded images)
        this.express.use('/media', express.static(path.join(__dirname, '../uploads')));

        // Routes
        this.express.use('/api', routes);

        // Route to check if server is working or not
        this.express.get('/', (req: Request, res: Response) => {
            res.send('Server Works! 🚀🚀 ');
        });

        this.express.get('/health', (req: Request, res: Response) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });
        });

        this.express.use(errorMiddleware);

        // If no route is matched
        this.express.use((req: Request, res: Response) => {
            res.status(404).send('Endpoint not found!');
        });
    }
}