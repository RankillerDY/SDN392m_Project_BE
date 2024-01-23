'use strict';

import { Types } from 'mongoose';
import { BadRequestError, NotFoundError, NotModified } from '~/core/errorResponse.core';
import courseSchema from '~/models/course.schema';
import subTrackSchema from '~/models/subtrack.schema';
import trackSchema from '~/models/track.schema';
import { ISubTrack, ITrackCourse } from '~/types';

import { getSelectData } from '~/utils/demo';
import SubTrackServices from './subTrack.services';
import CourseService from './course.services';

type ITrackCourseCreated = ITrackCourse & {
  _id: Types.ObjectId;
};

type ISubTrackCreated = ISubTrack & {
  _id: Types.ObjectId;
};

class TrackServices {
  static async createTracks(courseId: string, tracks: ITrackCourse[]) {
    const newTracksArr: ITrackCourseCreated[] = [];

    return trackSchema.startSession().then(async (session: any) => {
      session.startTransaction();
      try {
        // using for loop to separeted each track from the response
        for (let i = 0; i < tracks.length; i++) {
          const { chapterTitle, position, track_steps } = tracks[i];

          // get response from insertManySubTracks function
          const newSubTracks = await SubTrackServices.insertManySubTracks(track_steps);

          // get lists id from  new subtracks has created
          const newSubTracksIds = newSubTracks.map((subtrack: ISubTrackCreated) => subtrack._id);

          // create new track with new list subtracks id
          const newTrack = await trackSchema.create({
            position,
            chapterTitle,
            courseId: courseId,
            track_steps: newSubTracksIds
          });

          if (!newTrack) {
            await session.abortTransaction();
            session.endSession();
            throw new NotFoundError('Cannot Create Tracks').getNotice();
          }

          // get track id from newTrack has created
          const newTrackId = newTrack._id;

          // update course with new track id
          const insertResponse = await CourseService.addTracksIdToCourse(courseId, newTrackId);

          if (!insertResponse) {
            await session.abortTransaction();
            session.endSession();
            throw new NotFoundError('Cannot Create Tracks').getNotice();
          }
          await session.commitTransaction();

          // populate track with subtracks
          const finalTrackResponse = await newTrack.populate({
            path: 'track_steps',
            select: getSelectData(['_id', 'title', 'content_url', 'position', 'duration', 'type'])
          });

          // push new track to newTracks

          newTracksArr.push(finalTrackResponse);
        }

        return newTracksArr;
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new NotFoundError(error.message).getNotice();
      } finally {
        session.endSession();
      }
    });
  }
}

export = TrackServices;
