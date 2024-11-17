import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
    deliveryAttempts: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('CommunicationLog', communicationLogSchema);