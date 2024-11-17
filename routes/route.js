import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import * as segmentController from '../controllers/segmentController.js';
import * as campaignController from '../controllers/campaignController.js';
import * as deliveryController from '../controllers/deliveryController.js';

const router = express.Router();

// segment routes
router.post('/segments', isAuthenticated, segmentController.createSegment);
router.get('/segments', isAuthenticated, segmentController.getSegments);
router.get('/segments/:id', isAuthenticated, segmentController.getSegmentById);
router.put('/segments/:id', isAuthenticated, segmentController.updateSegment);
router.delete('/segments/:id', isAuthenticated, segmentController.deleteSegment);

// campaign routes
router.post('/campaigns', isAuthenticated, campaignController.createCampaign);
router.get('/campaigns', isAuthenticated, campaignController.getCampaigns);
router.get('/campaigns/:id', isAuthenticated, campaignController.getCampaignById);
router.put('/campaigns/:id', isAuthenticated, campaignController.updateCampaign);
router.delete('/campaigns/:id', isAuthenticated, campaignController.deleteCampaign);
router.post('/campaigns/:campaignId/send', isAuthenticated, campaignController.sendCampaign);

router.post('/delivery/:logId/status', deliveryController.updateDeliveryStatus);

export default router;