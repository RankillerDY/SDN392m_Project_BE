import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '~/core/errorResponse.core';
import newsfeedSchema, { newsFeedSchema } from '~/models/newsfeed.schema';
import { INewsFeed } from '~/types';
import { convertStringToObjectId } from '~/utils/demo';


class NewsfeedService {
  static async createNewsFeed(newsfeed: INewsFeed) {
    try {
      const { title, description, image }: INewsFeed = newsfeed;

      if (!title || !description || !image) {
        throw new NotFoundError('Newfeed id not found!');
      }

      const newsFeed = await newsfeedSchema.create({
        title,
        description,
        image
      });
      return newsFeed;
    } catch (error) {
      throw new NotFoundError('Create New Feed failed!');
    }
  }

  static async getNewFeedById(newFeedId: string) {
    try {
      const objectId = convertStringToObjectId(newFeedId);
      const newFeed = await newsfeedSchema.findById(objectId).lean(true);
      return newFeed ? newFeed : null;
    } catch (error) {
      throw new NotFoundError('Not found any new feed available!').getNotice();
    }
  }

  static async updateNewsFeedById(newFeedId: string, updatedAt: Partial<INewsFeed>): Promise<INewsFeed | null> {
    try {
      const updatedNewsFeed = await newsfeedSchema.findByIdAndUpdate(newFeedId, updatedAt, { new: true })
      return updatedNewsFeed
    }
    catch(error) {
      throw new BadRequestError('Error updating news feed!')
    }
  }

  static async changeNewsFeedStatusById(newFeedId: string, status: string): Promise<INewsFeed | null> {
    try {
      const changeStatus = await newsfeedSchema.findByIdAndUpdate(newFeedId, { status }, { new: true })
      return changeStatus
    }
    catch(error) {
      throw new BadRequestError('Error changing news feed status!')
    }
  }
}

export = NewsfeedService;
