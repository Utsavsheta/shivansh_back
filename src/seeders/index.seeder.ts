import { Sequelize } from 'sequelize';
import { initializeDatabase } from '../config/database';
import { initMySQLModels } from '../models/index.model';
import { seedUsers } from './users.seeder';
import { seedPermissions } from './permissions.seeder';
import { seedUserPermissions } from './user-permissions.seeder';
import { seedCategories } from './categories.seeder';
import { seedJewelleryTypes } from './jewellery-types.seeder';

// run all seeds
export const runSeeds = async (connection: Sequelize) => {
    await seedUsers(connection);
    await seedPermissions(connection);
    await seedUserPermissions(connection);
    await seedCategories(connection);
    await seedJewelleryTypes(connection);
}

// Allow `npm run seed` to execute seeding directly
if (require.main === module) {
    (async () => {
        let sequelize: Sequelize | undefined;
        try {
            console.log('Initializing database connection for seeding...');
            sequelize = await initializeDatabase();

            console.log('Initializing models for seeding...');
            initMySQLModels(sequelize);

            console.log('Synchronizing database...');
            await sequelize.sync({ alter: true });

            console.log('Running seeders...');
            await runSeeds(sequelize);

            console.log('🌱 Seeding completed');
            await sequelize.close();
            process.exit(0);
        } catch (error) {
            console.error('❌ Seeding failed:', error);
            if (sequelize) await sequelize.close();
            process.exit(1);
        }
    })();
}
