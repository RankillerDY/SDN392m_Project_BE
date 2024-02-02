import { Router } from "express";
import newfeedController from "~/controllers/newfeed.controller";
import { asyncHandler } from "~/helper/asyncHandler";

const newfeedRouter = Router()

newfeedRouter.post('/create-newfeed', asyncHandler(newfeedController.createNewFeed))
newfeedRouter.get('/get-new-feed/:id', asyncHandler(newfeedController.getNewFeedById))
newfeedRouter.put('update-new-feed/:id', asyncHandler(newfeedController.updateNewsFeedById))
newfeedRouter.put('/newfeed/:id/status', asyncHandler(newfeedController.changeNewsFeedStatusById))

export default newfeedRouter