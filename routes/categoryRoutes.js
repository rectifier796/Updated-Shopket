import expres from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } from '../controllers/categoryController.js';

const categoryRoutes = expres.Router();

//routes

//create category
categoryRoutes.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//update category
categoryRoutes.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

//get all category
categoryRoutes.get('/get-category', categoryController);

//single category
categoryRoutes.get('/single-category/:slug', singleCategoryController);

//delete category
categoryRoutes.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);


export default categoryRoutes;