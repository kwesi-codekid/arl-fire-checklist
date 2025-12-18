
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../db/models/User';
import { connectDB } from '../db/connect';

async function fixDuplicates() {
    try {
        await connectDB();
        console.log('Connected to database...');

        // Get all users sorted by creation time
        const users = await User.find({}).sort({ createdAt: 1 });

        console.log(`Scanning ${users.length} users for ID conflicts...`);

        // Keep track of used IDs
        const usedIds = new Set<string>();

        // Let's reserve specific IDs for our known 'new' users if we want
        // OR just simple re-assignment.
        // Let's try to keep ADMIN001, EMP001 (John Doe), EMP002 (Jane Smith) if possible.

        // Strategy: 
        // 1. First pass: Register IDs of "privileged" users to lock them.
        // 2. Second pass: Assign available IDs to everyone else.

        const privilegedUsers = ['John Doe', 'Jane Smith', 'Admin User'];
        const privilegedMap = {
            'John Doe': 'EMP001',
            'Jane Smith': 'EMP002',
            'Admin User': 'ADMIN001'
        };

        // Reset everyone's ID temporarily to avoid unique index collision during update?
        // Actually, since unique index isn't enforcing yet (hence duplicates), we can just update.
        // But we want to ENFORCE unique index later.

        let empCounter = 3; // Start assigning from EMP003 for others

        for (const user of users) {
            let newId = '';

            if (user.name === 'John Doe') newId = 'EMP001';
            else if (user.name === 'Jane Smith') newId = 'EMP002';
            else if (user.name === 'Admin User') newId = 'ADMIN001';
            else {
                // Assign next available ID
                newId = `EMP${String(empCounter).padStart(3, '0')}`;
                empCounter++;
            }

            // Update the user
            if (user.employeeId !== newId) {
                await User.updateOne({ _id: user._id }, { $set: { employeeId: newId } });
                console.log(`Updated ${user.name}: ${user.employeeId} -> ${newId}`);
            } else {
                console.log(`Kept ${user.name}: ${newId}`);
            }
        }

        console.log('\n✅ Duplicate fix completed.');

        // Now verify
        const finalUsers = await User.find({}).sort({ employeeId: 1 });
        console.log('\n--- FINAL USER LIST ---');
        finalUsers.forEach(u => console.log(`${u.employeeId.padEnd(10)} ${u.name}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

fixDuplicates();
