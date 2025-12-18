/**
 * Script to Add New Users with Employee IDs
 * 
 * This script allows you to add new users to the database with their employee IDs.
 * 
 * Usage: node --import tsx app/scripts/add-user.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../db/models/User';
import { connectDB } from '../db/connect';

// Define your users here
const newUsers = [
    {
        employeeId: 'EMP001',
        name: 'John Doe',
        role: 'inspector'
    },
    {
        employeeId: 'EMP002',
        name: 'Jane Smith',
        role: 'inspector'
    },
    {
        employeeId: 'ADMIN001',
        name: 'Admin User',
        role: 'admin'
    }
    // Add more users as needed
];

async function addUsers() {
    try {
        await connectDB();
        console.log('Connected to database...\n');

        for (const userData of newUsers) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ employeeId: userData.employeeId });

                if (existingUser) {
                    console.log(`⚠️  User with Employee ID ${userData.employeeId} already exists. Skipping...`);
                    continue;
                }

                // Create new user
                const user = new User(userData);
                await user.save();

                console.log(`✓ Added user: ${userData.name} (${userData.employeeId}) - Role: ${userData.role}`);
            } catch (error: any) {
                console.error(`❌ Failed to add user ${userData.name}:`, error.message);
            }
        }

        console.log('\n✅ User creation completed!');

        // Display all users
        console.log('\nCurrent users in database:');
        const allUsers = await User.find({}).select('name employeeId role');
        allUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.employeeId}) - ${user.role}`);
        });

    } catch (error) {
        console.error('❌ Operation failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

// Run the script
addUsers();
