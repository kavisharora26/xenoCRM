import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { buildSegmentQuery } from '../utils/segmentBuilder.js';

export const createSegment = async (req, res) => {
    try {
        const { name, conditions } = req.body;
        const query = buildSegmentQuery(conditions);
        const audienceSize = await Customer.countDocuments({
            $and: query
        });
        const segment = new Segment({
            name,
            conditions,
            audienceSize,
            createdBy: req.user.email
        });
        await segment.save();
        res.status(201).json(segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSegments = async (req, res) => {
    try {
        const segments = await Segment.find({ createdBy: req.user.email })
                                    .sort({ createdAt: -1 });
        res.json(segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSegmentById = async (req, res) => {
    try {
        const segment = await Segment.findOne({
            _id: req.params.id,
            createdBy: req.user.email
        });

        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        const query = buildSegmentQuery(segment.conditions);
        const audienceSize = await Customer.countDocuments({
            $and: query
        });
        if (segment.audienceSize !== audienceSize) {
            segment.audienceSize = audienceSize;
            await segment.save();
        }
        res.json(segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSegment = async (req, res) => {
    try {
        const segment = await Segment.findOne({
            _id: req.params.id,
            createdBy: req.user.email
        });

        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }

        await segment.deleteOne();
        res.json({ message: 'Segment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSegment = async (req, res) => {
    try {
        const { name, conditions } = req.body;
        const segment = await Segment.findOne({
            _id: req.params.id,
            createdBy: req.user.email
        });

        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        const query = buildSegmentQuery(conditions);
        const audienceSize = await Customer.countDocuments({
            $and: query
        });
        segment.name = name;
        segment.conditions = conditions;
        segment.audienceSize = audienceSize;
        await segment.save();
        res.json(segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};