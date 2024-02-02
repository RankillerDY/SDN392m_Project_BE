//Chứa các file chứa các hằng số

export const DEFAULT_PORT = 3500;
export const DEFAULT_BASE_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const DUPLICATE_CODE_ERROR = 11000;
export enum USER_ROLE {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export const StatusCode = {
  OK: 200,
  CREATED: 201
};

export const ReasonError = {
  OK: 'Success',
  CREATED: 'Created'
};

export enum ERROR {
  CAST_ERROR = 'CastError',
  DUPLICATE_VALUE = DUPLICATE_CODE_ERROR,
  JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError'
}
export enum MESSAGE {
  INVALID_TOKEN = 'Access Token is not valid',
  REQUEST_LOGIN_TO_ACCESS = 'Please login to access this resource',
  GET_COURSE_SUCCESS = 'Get all free course successfully !',
  GET_COURSE_PRO_SUCCESS = 'Get all pro course successfully !',
  CREATED_COURSE_SUCCESS = 'Create course successfully !',
  GET_COURSE_SEMESTER_SUCCESS = 'Get course by semester successfully !',
  INVALID_JSON_TOKEN = 'Json web token is invalid, try again',
  EXPIRED_JSON_TOKEN = 'Json web token is expired, try again',
  GET_TRACKS_WITH_COURSE_ID_SUCCESS = 'Get all tracks with courseID successfully !',
  CREATED_TRACKS_SUCCESS = 'Create tracks successfully !',
  ENROLL_COURSE_SUCCESS = 'Enroll course successfully !',
  GET_CART_BY_USER_ID_SUCCESS = 'Get cart by user id successfully !',
  CREATED_NEW_FEED_SUCCESS = 'Create newfeed successfully!',
  GET_NEWFEED_SUCCESS = 'Get all new feed successfully!',
  DELETE_MANY_TRACKS_SUCCESS = 'Delete many tracks successfully !',
  GET_COURSE_BY_ID_SUCCESS = 'Get course by id successfully !',
  ADD_TO_CART_SUCCESS = 'Add to cart successfully !',
  DELETE_ITEMS_FROM_CART_SUCCESS = 'Delete items from cart successfully !',
  DELETE_TRACK_BY_ID_SUCCESS = 'Delete track by id successfully !',

  // BLOG MESSAGE
  GET_ALL_BLOG_SUCCESS = 'Get all blog successfully !',
  GET_BLOG_BY_ID_SUCCESS = 'Get blog by id successfully !',
  CREATED_BLOG_SUCCESS = 'Create blog successfully !',
  UPDATED_BLOG_SUCCESS = 'Update blog successfully !',
  DELETED_BLOG_SUCCESS = 'Delete blog successfully !'
}
