import Campaign from '../models/Campaign.js';
import CommunicationLog from '../models/CommunicationLog.js';
import Customer from '../models/Customer.js';
import Segment from '../models/Segment.js';
import messageQueue from '../helper/messageQueue.js';

export const createCampaign = async (req, res) => {
    try {
        const { name, segmentId, message } = req.body;
        
        const campaign = new Campaign({
            name,
            segmentId,
            message,
            createdBy: req.user.email
        });
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ createdBy: req.user.email })
                                      .populate('segmentId')
                                      .sort({ createdAt: -1 });
        const campaignsWithStats = await Promise.all(campaigns.map(async (campaign) => {
            const logs = await CommunicationLog.find({ campaignId: campaign._id });
            const sentCount = logs.filter(log => log.status === 'DELIVERED').length;
            const failedCount = logs.filter(log => log.status === 'FAILED').length;
            
            return {
                ...campaign.toObject(),
                sentCount,
                failedCount
            };
        }));
        res.json(campaignsWithStats);
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ 
            _id: req.params.id, 
            createdBy: req.user.email 
        }).populate('segmentId');

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        const logs = await CommunicationLog.find({ campaignId: campaign._id });
        const sentCount = logs.filter(log => log.status === 'DELIVERED').length;
        const failedCount = logs.filter(log => log.status === 'FAILED').length;
        const campaignWithStats = {
            ...campaign.toObject(),
            sentCount,
            failedCount
        };
        res.json(campaignWithStats);
    } catch (error) {
        console.error('Get campaign by ID error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const { name, segmentId, message } = req.body;
        const campaign = await Campaign.findOne({ 
            _id: req.params.id, 
            createdBy: req.user.email 
        });
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        if (campaign.status === 'SENT') {
            return res.status(400).json({ error: 'Cannot update a campaign that has already been sent' });
        }
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { name, segmentId, message },
            { new: true, runValidators: true }
        );
        res.json(updatedCampaign);
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ 
            _id: req.params.id, 
            createdBy: req.user.email 
        });
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        if (campaign.status === 'SENT') {
            return res.status(400).json({ error: 'Cannot delete a campaign that has already been sent' });
        }
        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const sendCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findById(campaignId); 
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        const segment = await Segment.findById(campaign.segmentId);
        const query = buildSegmentQuery(segment.conditions);
        const customers = await Customer.find({ $and: query });
        const logs = customers.map(customer => ({
            campaignId: campaign._id,
            customerId: customer._id,
            message: campaign.message.replace('[Name]', customer.name)
        }));
        await CommunicationLog.insertMany(logs);
        await messageQueue.publishMessage('campaign_messages', {
            campaignId: campaign._id,
            logs: logs.map(log => log._id)
        });
        campaign.status = 'SENT';
        await campaign.save();
        res.json({ message: 'Campaign queued for sending' });
    } catch (error) {
        console.error('Send campaign error:', error);
        res.status(500).json({ error: error.message });
    }
};