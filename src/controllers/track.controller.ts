import { Response, Request } from 'express';
import { MESSAGE } from '~/constants';
import { CREATED, OK } from '~/core/successResponse.core';
import TrackServices from '~/services/track.services';
import { ITrackCourse } from '~/types';

interface ICreatedTrack {
  courseId: string;
  tracks: ITrackCourse[];
}

class TrackController {
  async createTracks(req: Request, res: Response) {
    const { courseId, tracks }: ICreatedTrack = req.body;
    return new CREATED({
      message: MESSAGE.CREATED_TRACKS_SUCCESS,
      metadata: await TrackServices.createTracks(courseId, tracks)
    }).send(res);
  }
}

export = new TrackController();
