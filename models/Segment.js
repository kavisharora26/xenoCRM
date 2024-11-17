import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed,
    logicalOperator: { type: String, enum: ['AND', 'OR'], default: 'AND' }
});

const segmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conditions: [conditionSchema],
    audienceSize: { type: Number, default: 0 },
    createdBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Segment', segmentSchema);