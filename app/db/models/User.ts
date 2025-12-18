import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['inspector', 'admin'], default: 'inspector' },
    password: { type: String } // In a real app, this should be hashed.
}, {
    timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
