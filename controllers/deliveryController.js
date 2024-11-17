export const updateDeliveryStatus = async (req, res) => {
    try {
        const { logId } = req.params;
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        
        const log = await CommunicationLog.findById(logId);
        log.status = status;
        log.deliveryAttempts += 1;
        await log.save();
        const campaign = await Campaign.findById(log.campaignId);
        if (status === 'SENT') {
            campaign.sentCount += 1;
        } else {
            campaign.failedCount += 1;
        }
        await campaign.save();
        
        res.json({ status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};