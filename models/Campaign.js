import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'SENT', 'COMPLETED'], default: 'DRAFT' },
    createdBy: { type: String, required: true }, // Google user email
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);