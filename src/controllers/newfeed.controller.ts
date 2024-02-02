import { MESSAGE } from '~/constants';
import { CREATED, OK } from '~/core/successResponse.core';
import NewsfeedService from '~/services/newsfeed.services';
import { Response, Request } from 'express';

class NewFeedController {

  async createNewFeed(req: Request, res: Response) {
    return new CREATED({
      message: MESSAGE.CREATED_NEW_FEED_SUCCESS,
      metadata: await NewsfeedService.createNewsFeed(req.body)
    }).send(res);
  }

  async getNewFeedById(req: Request, res: Response) {
    const newFeedId = req.params._id;
    try {
      const metadata = await NewsfeedService.getNewFeedById(newFeedId);
      const message = MESSAGE.GET_NEWFEED_SUCCESS;
      return new OK({
        message,
        metadata
      }).send(res);
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error!' });
    }
  }

  async updateNewsFeedById(req: Request, res: Response) {
    const { newsFeedId } = req.params
    const { title, description, image } = req.body

    try {
      const metadata = await NewsfeedService.updateNewsFeedById(newsFeedId, { title, description, image })
      return new OK({
        message: 'Update News Feed successfully!',
        metadata
      }).send(res)
    }
    catch (error) {
      return res.status(500).send({ error: 'Internal Server Error!' })
    }
  }

  async changeNewsFeedStatusById(req: Request, res: Response) {
    try {
      const { newFeedId } = req.params
      const { status } = req.body
      const metadata = await NewsfeedService.changeNewsFeedStatusById(newFeedId, status)
      return new OK({
        message: 'Change News Feed Status successfully!',
        metadata
      }).send(res)
    }
    catch(error) {
      return res.status(500).send({ error: 'Internal Server Error!' })
    }
  }
}

export = new NewFeedController();
