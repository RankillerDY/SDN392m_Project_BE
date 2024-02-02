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
    const { courseId } = req.params;
    const { tracks }: ICreatedTrack = req.body;
    return new CREATED({
      message: MESSAGE.CREATED_TRACKS_SUCCESS,
      metadata: await TrackServices.createTracks(courseId, tracks)
    }).send(res);
  }

  async deleteTrackById(req: Request, res: Response) {
    const { courseId, trackId } = req.params;
    return new CREATED({
      message: MESSAGE.DELETE_TRACK_BY_ID_SUCCESS,
      metadata: await TrackServices.deleteTrackById(courseId, trackId)
    }).send(res);
  }

  async deleteManyTracks(req: Request, res: Response) {
    const { trackIds } = req.body;
    const { courseId } = req.params;
    return new CREATED({
      message: MESSAGE.DELETE_MANY_TRACKS_SUCCESS,
      metadata: await TrackServices.deleteManyTracks(trackIds, courseId)
    }).send(res);
  }
}

export = new TrackController();
