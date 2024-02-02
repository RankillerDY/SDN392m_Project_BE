'use strict';

import { ClientSession, Types } from 'mongoose';
import { NotFoundError, NotModified } from '~/core/errorResponse.core';
import subTrackSchema from '~/models/subtrack.schema';
import trackSchema from '~/models/track.schema';
import { ISubTrack, ITrackCourse } from '~/types';

import courseSchema from '~/models/course.schema';
import { getSelectData } from '~/utils/demo';
import CourseService from './course.services';
import SubTrackServices from './subTrack.services';

type ITrackCourseDocumentCreated = ITrackCourse & {
  _id: Types.ObjectId;
};

type ISubTrackDocumentCreated = ISubTrack & {
  _id: Types.ObjectId;
};

type ISubTracDocumentkMap = Types.Subdocument<Types.ObjectId> & ISubTrack;

class TrackServices {
  static async createTracks(courseId: string, tracks: ITrackCourse[]) {
    const newTracksArr: ITrackCourseDocumentCreated[] = [];

    return trackSchema.startSession().then(async (session: ClientSession) => {
      session.startTransaction();
      try {
        // using for loop to separeted each track from the response
        for (let i = 0; i < tracks.length; i++) {
          const { chapterTitle, position, track_steps } = tracks[i];

          // get response from insertManySubTracks function
          const newSubTracks = await SubTrackServices.insertManySubTracks(track_steps);

          // get lists id from  new subtracks has created
          const newSubTracksIds = newSubTracks.map((subtrack: ISubTrackDocumentCreated) => subtrack._id);

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

  static async deleteTrackById(courseId: string, trackId: string) {
    const foundTrack = await trackSchema.findById(trackId);
    if (!foundTrack) {
      throw new NotFoundError('Track not found').getNotice();
    }

    const foundCourse = await courseSchema.findOne({
      _id: courseId,
      tracks: trackId
    });

    if (!foundCourse) {
      throw new NotFoundError('Course not found').getNotice();
    }

    // delete all subtracks existed in foundTrack
    const subTracksIds = foundTrack.track_steps.map((subtrack: ISubTracDocumentkMap) => {
      return subtrack._id;
    }) as Types.ObjectId[];

    return trackSchema
      .startSession()
      .then(async (session: ClientSession) => {
        session.startTransaction();
        try {
          //  delete all subTracks existed in tracks
          if (subTracksIds.length) {
            const deleteResponse = await subTrackSchema.deleteMany({ _id: { $in: subTracksIds } }, { session });
            if (!deleteResponse) {
              await session.abortTransaction();
              session.endSession();
              throw new NotModified('Delete failed when delete subtrack !').getNotice();
            }
          }

          // delete track from course
          const courseResponse = await courseSchema
            .findOneAndUpdate(
              {
                tracks: trackId
              },
              {
                $pull: {
                  tracks: trackId
                }
              },
              {
                new: true
              }
            )
            .session(session);
          if (!courseResponse) {
            await session.abortTransaction();
            session.endSession();
            throw new NotModified('Delete failed when remove current track from course!').getNotice();
          }

          const { deletedCount } = await foundTrack.deleteOne({
            _id: trackId
          });

          if (!deletedCount) {
            throw new NotModified('Delete track with given id failed !').getNotice();
          }

          await session.commitTransaction();
          session.endSession();
          return {
            deletedCount
          };
        } catch (error: any) {
          await session.abortTransaction();
          session.endSession();
          throw new NotModified(error.message).getNotice();
        }
      })
      .catch((error: any) => {
        throw new NotModified(error.message).getNotice();
      });
  }

  static async deleteManyTracks(trackIds: string[], courseId: string) {
    // convert trackIds to Array of ObjectId
    const trackIdsArrObjId = trackIds.map((trackId: string) => new Types.ObjectId(trackId));
    console.log('trackIdsArrObjId', trackIdsArrObjId);

    // check all tracks  existed in course

    // get all subtracks from tracks and get list of id only using aggregate
    const subTracksIds = await trackSchema.aggregate([
      {
        $match: {
          _id: {
            $in: trackIdsArrObjId
          }
        }
      },
      {
        $unwind: '$track_steps'
      }
    ]);
    //  get all courses which include specified tracks
    const courseFound = await courseSchema
      .findOne({
        _id: courseId,
        tracks: {
          $in: trackIdsArrObjId
        }
      })
      .select(['_id', 'tracks']);

    console.log('courses', courseFound);

    if (!courseFound) {
      throw new NotFoundError('Did match any course contains any given tracks id !').getNotice();
    }

    return trackSchema
      .startSession()
      .then(async (session: ClientSession) => {
        // start transaction
        session.startTransaction();
        // remove all subtracks from tracks first
        if (subTracksIds.length) {
          try {
            const deleteSubTracksResponse = await subTrackSchema.deleteMany(
              { _id: { $in: subTracksIds } },
              { session }
            );

            if (!deleteSubTracksResponse) {
              await session.abortTransaction();
              session.endSession();
              throw new NotModified('Delete failed when delete subtracks process !').getNotice();
            }
          } catch (error: any) {
            throw new NotModified(error.message).getNotice();
          }
        }

        try {
          // pull all tracks from courseFound
          const courseResponse = await courseSchema.findOneAndUpdate(
            {
              _id: courseId
            },
            {
              $pull: {
                tracks: {
                  $in: trackIdsArrObjId
                }
              }
            },
            { session }
          );

          if (!courseResponse) {
            await session.abortTransaction();
            session.endSession();
            throw new NotModified('Delete failed when delete tracks from course process !').getNotice();
          }

          // then delete all tracks
          const { deletedCount } = await trackSchema.deleteMany(
            {
              _id: {
                $in: trackIdsArrObjId
              }
            },
            { session }
          );

          if (!deletedCount) {
            throw new NotModified('Delete array of track specified failed !').getNotice();
          }

          await session.commitTransaction();
          session.endSession();
          return {
            deletedCount
          };
        } catch (error: any) {
          throw new NotModified(error.message).getNotice();
        }
      })
      .catch((error: any) => {
        throw new NotModified(error.message).getNotice();
      });
  }
}

export = TrackServices;
