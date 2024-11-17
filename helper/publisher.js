import express from 'express';
import messageQueue from './messageQueue.js';

const router = express.Router();

router.post('/customers', async (req, res) => {
    try {
        const customerData = req.body;
        await messageQueue.publishMessage('customer_data', customerData);
        res.status(200).json({ 
            message: 'Customer data queued for processing'
        });
    } catch (error) {
        console.error('Error publishing customer data:', error);
        res.status(500).json({ error: 'Failed to process customer data' });
    }
});

export default router;

import messageQueue from './messageQueue.js';
import CustomerModel from './models/customer.js';

async function startConsumer() {
    try {
        await messageQueue.connect();
        
        await messageQueue.consumeMessages('customer_data', async (data) => {
            try {
                const customer = new CustomerModel(data);
                await customer.save();
                console.log('Customer data processed and saved:', data);
            } catch (error) {
                console.error('Error processing customer data:', error);
            }
        });
    } catch (error) {
        console.error('Consumer startup error:', error);
    }
}

startConsumer();