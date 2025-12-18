/**
 * Migration Script: Add Employee IDs to Existing Users
 * 
 * This script adds employeeId field to existing users in the database.
 * Run this script once to migrate your existing data.
 * 
 * Usage: node --import tsx app/scripts/migrate-users.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../db/models/User';
import { connectDB } from '../db/connect';

async function migrateUsers() {
    try {
        await connectDB();
        console.log('Connected to database...');

        // Get all users without employeeId
        const users = await User.find({ employeeId: { $exists: false } });

        if (users.length === 0) {
            console.log('No users to migrate. All users already have employee IDs.');
            return;
        }

        console.log(`Found ${users.length} users to migrate...`);

        // Example migration: Generate employee IDs based on existing data
        // You can customize this logic based on your needs
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // Generate a simple employee ID (e.g., EMP001, EMP002, etc.)
            // Or you can manually assign specific IDs
            const employeeId = `EMP${String(i + 1).padStart(3, '0')}`;

            await User.updateOne(
                { _id: user._id },
                { $set: { employeeId } }
            );

            console.log(`✓ Migrated user: ${user.name} -> Employee ID: ${employeeId}`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\nIMPORTANT: Please note the following employee IDs for your users:');

        const allUsers = await User.find({}).select('name employeeId');
        allUsers.forEach(user => {
            console.log(`  - ${user.name}: ${user.employeeId}`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

// Run the migration
migrateUsers();
