import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { NotFoundError, NotModified } from '~/core/errorResponse.core';
import subTrackSchema from '~/models/subtrack.schema';
import { ISubTrack } from '~/types';
dotenv.config();

class SubTrackServices {
  static async insertManySubTracks(subTracks: Types.DocumentArray<ISubTrack>) {
    // create transaction when insert many subtracks
    return subTrackSchema.startSession().then(async (session: any) => {
      session.startTransaction();
      try {
        const newSubTracks = await subTrackSchema.insertMany(subTracks, { session });
        if (!newSubTracks) {
          await session.abortTransaction();
          session.endSession();
          throw new NotFoundError('Create failed when insert subtracks !').getNotice();
        }
        await session.commitTransaction();
        session.endSession();

        return newSubTracks;
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new NotModified(error.message).getNotice();
      }
    });
  }
}

export default SubTrackServices;
