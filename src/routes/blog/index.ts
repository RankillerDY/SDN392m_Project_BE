import { Router } from 'express';
import blogController from '~/controllers/blog.controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { isAuthenticated, isAuthor } from '~/middleware/authenticate';

const blogRouter = Router();

blogRouter.post('', isAuthenticated, asyncHandler(blogController.createBlog));
blogRouter.put('/:id', isAuthenticated, isAuthor, asyncHandler(blogController.updateBlog));
blogRouter.get('', asyncHandler(blogController.getBlog));
blogRouter.delete('/:id', isAuthenticated, isAuthor, asyncHandler(blogController.deleteBlog));
blogRouter.get('/:id', asyncHandler(blogController.getBlogById));

export default blogRouter;
