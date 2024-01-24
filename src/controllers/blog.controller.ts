import { Response, Request } from 'express';
import { MESSAGE } from '~/constants';
import { CREATED, OK } from '~/core/successResponse.core';
import BlogService from '~/services/blog.services';

class BlogController {
  // Get all blog
  async getBlog(req: Request, res: Response) {
    return new OK({
      message: MESSAGE.GET_ALL_BLOG_SUCCESS,
      metadata: await BlogService.getAllBlog()
    }).send(res);
  }

  // Get blog by id
  async getBlogById(req: Request, res: Response) {
    const blogId = req.params.id;
    return new OK({
      message: MESSAGE.GET_BLOG_BY_ID_SUCCESS,
      metadata: await BlogService.getBlogById(blogId)
    }).send(res);
  }

  // Create blog
  async createBlog(req: Request, res: Response) {
    return new CREATED({
      message: MESSAGE.CREATED_BLOG_SUCCESS,
      metadata: await BlogService.createBlog(req.body)
    }).send(res);
  }

  // Update blog
  async updateBlog(req: Request, res: Response) {
    const blogId = req.params.id;
    return new OK({
      message: MESSAGE.UPDATED_BLOG_SUCCESS,
      metadata: await BlogService.updateBlog(req.body, blogId)
    }).send(res);
  }

  // Delete blog
  async deleteBlog(req: Request, res: Response) {
    const blogId = req.params.id;
    return new OK({
      message: MESSAGE.DELETED_BLOG_SUCCESS,
      metadata: await BlogService.deleteBlog(blogId)
    }).send(res);
  }
}
export = new BlogController();
