import { Request } from 'express';
import { HydratedDocument, Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '~/core/errorResponse.core';
import blogSchema from '~/models/blog.schema';
import { IBlog } from '~/types';
import { convertStringToObjectId, getSelectData } from '~/utils/demo';

type BlogCreated = IBlog & {
  _id: Types.ObjectId;
};

class BlogService {
  static async getAllBlog() {
    const allBlogs: HydratedDocument<IBlog> = await blogSchema
      .find()
      .populate({
        path: 'userId',
        select: getSelectData(['_id', 'email', 'fullName', 'profileName', 'profile_image'])
      })
      .lean();
    if (!allBlogs) {
      throw new NotFoundError('Not found any blog available').getNotice();
    }
    return allBlogs;
  }

  static async getBlogById(blogId: string) {
    try {
      const objectId = convertStringToObjectId(blogId);

      const blog: HydratedDocument<IBlog> | null = await blogSchema
        .findById(objectId)
        .populate({
          path: 'userId',
          select: getSelectData(['_id', 'email', 'fullName', 'profileName', 'profile_image']),
        })
        .lean();

      if (!blog) {
        throw new NotFoundError('Not found any blog available').getNotice();
      }

      return blog;
    } catch (error) {
      throw new NotFoundError('Not found any blog available').getNotice();
    }
  }

  static async createBlog(req: Request, blog: IBlog) {
    const newBlog = new blogSchema(blog);
    newBlog.userId = req.user._id;
    // Khởi tạo phiên làm việc với transaction
    const session = await blogSchema.startSession();
    session.startTransaction();
    try {
      // Xử lý tạo mới và lưu blog
      const blogCreated: BlogCreated = await newBlog.save({ session });
      await session.commitTransaction(); // Lưu lại thay đổi
      session.endSession(); // Kết thúc phiên làm việc
      return blogCreated;
    } catch (error) {
      // Nếu có lỗi xảy ra thì rollback lại
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError('Create blog failed').getNotice();
    }
  }

  static async updateBlog(blog: IBlog, blogId: string) {
    const objectId = convertStringToObjectId(blogId);
    const blogFound = await blogSchema.findById(objectId);
    if (!blogFound) {
      throw new NotFoundError('Not found any blog available').getNotice();
    }
    // Cập nhật "date_modified" của blog
    blog.date_modified = new Date();
    blog.userId = blogFound.userId;
    // Khởi tạo phiên làm việc với transaction
    const session = await blogSchema.startSession();
    session.startTransaction();
    try {
      // Xử lý update và lưu blog
      const blogUpdated: HydratedDocument<IBlog> | null = await blogSchema
        .findByIdAndUpdate(objectId, blog, { new: true, session })
        .populate({
          path: 'userId',
          select: getSelectData(['_id', 'email', 'fullName', 'profileName', 'profile_image']),
        })
        .lean();

      await session.commitTransaction(); // Lưu lại thay đổi
      session.endSession(); // Kết thúc phiên làm việc
      return blogUpdated;
    } catch (error) {
      // Nếu có lỗi xảy ra thì rollback lại
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError('Update blog failed').getNotice();
    }
  }

  static async deleteBlog(blogId: string) {
    const objectId = convertStringToObjectId(blogId);
    const blogFound = await blogSchema.findById(objectId);
    if (!blogFound) {
      throw new NotFoundError('Not found any blog available').getNotice();
    }
    // Khởi tạo phiên làm việc với transaction
    const session = await blogSchema.startSession();
    session.startTransaction();
    try {
      // Xử lý xóa blog
      const blogDeleted: HydratedDocument<IBlog> | null = await blogSchema
        .findByIdAndDelete(objectId, { session })
        .populate({
          path: 'userId',
          select: getSelectData(['_id', 'email', 'fullName', 'profileName', 'profile_image']),
        })
        .lean();

      await session.commitTransaction(); // Lưu lại thay đổi
      session.endSession(); // Kết thúc phiên làm việc
      return blogDeleted;
    } catch (error) {
      // Nếu có lỗi xảy ra thì rollback lại
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError('Delete blog failed').getNotice();
    }
  }
}

export = BlogService;
