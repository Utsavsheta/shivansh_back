import { Sequelize } from 'sequelize';
import { User } from '../models/user.model';
import { DEFAULT_USERS } from './constants';
import cryptoHelper from '../utils/crypto-helper';

export const seedUsers = async (connection: Sequelize) => {
    const transaction = await connection.transaction();
    try {
        // Check if users already exist
        const existingUsersCount = await User.count({ transaction });
        
        if (existingUsersCount > 0) {
            console.log(`Users already exist (${existingUsersCount} records). Skipping user seeding.`);
            await transaction.commit();
            return;
        }

        console.log('No users found. Starting user seeding...');

        // Prepare user data with hashed passwords
        const usersToSeed = await Promise.all(
            DEFAULT_USERS.map(async (user) => {
                const hashed = await cryptoHelper.hashAsync(user.password);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: hashed,
                    role: user.role,
                    is_deleted: user.is_deleted,
                };
            })
        );

        // Bulk create with updateOnDuplicate
        await User.bulkCreate(usersToSeed, {
            transaction,
            updateOnDuplicate: ['name', 'email', 'password', 'role', 'is_deleted', 'updated_at']
        });

        console.log(`Bulk processed ${DEFAULT_USERS.length} users successfully`);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log("Error seeding users: ", error);
        throw error;
    }
}


