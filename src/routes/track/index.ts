import { Router } from 'express';
import trackController from '~/controllers/track.controller';
import { asyncHandler } from '~/helper/asyncHandler';

const trackRouter = Router();

trackRouter.post('/create-tracks', asyncHandler(trackController.createTracks));

export default trackRouter;
