import { Sequelize } from 'sequelize';
import { seedUsers } from './users.seeder';

// run all seeds
export const runSeeds = async (connection: Sequelize) => {
    await seedUsers(connection);
}
