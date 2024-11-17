import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpending: { type: Number, default: 0 },
    lastVisit: { type: Date },
    visitCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);