import 'dotenv/config';
import { createServer } from 'http';
import { Sequelize } from 'sequelize';
import { App } from './app';
import { initializeDatabase } from './config/database';
import { initMySQLModels } from './models/index.model';
import { runSeeds } from './seeders/index.seeder';
import env from './utils/validate-env';

const app = new App();
const port = process.env.PORT || 5005;
console.log('port: ', port);

// Create HTTP server
const httpServer = createServer(app.express);

export let sequelize: Sequelize;

(async () => {
  try {
    // Initialize database connection
    console.log('Initializing database connection...');
    sequelize = await initializeDatabase();

    // Initialize models
    console.log('Initializing models...');
    initMySQLModels(sequelize);

    // Run alter operation safely
    console.log('Running alter operation...');
    await sequelize.sync({ alter: true });
    console.log('✅ Sequelize OK - Database synchronized successfully');

    // Optionally run seeders
    if (env.SEED === true) {
      await runSeeds(sequelize);
      console.log('🌱 Seeding completed');
    }

    // Start the server
    httpServer.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Error initializing server:', err);
    console.error('Unable to connect to the database.');
    process.exit(1); // Exit with failure
  }
})();
