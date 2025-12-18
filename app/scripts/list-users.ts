
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../db/models/User';
import { connectDB } from '../db/connect';

async function listUsers() {
    try {
        await connectDB();
        console.log('Connected to database...');

        const users = await User.find({}).sort({ employeeId: 1 });

        console.log('\n--- CURRENT USERS ---');
        console.log('ID'.padEnd(10) + 'Name');
        console.log('-'.repeat(30));

        users.forEach(u => {
            console.log(`${u.employeeId?.padEnd(10)} ${u.name}`);
        });
        console.log('---------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

listUsers();
