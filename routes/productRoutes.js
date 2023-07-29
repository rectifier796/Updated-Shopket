import expres from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, getProductController, updateProductController, getSingleProductController, deleteProductController, productPhotoController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } from "../controllers/productController.js";
import formidable from "express-formidable";

const productRoutes = expres.Router();

//routes

// create products
productRoutes.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//get products
productRoutes.get('/get-product', getProductController)

//get single products
productRoutes.get('/get-product/:slug', getSingleProductController)

// get photo
productRoutes.get('/product-photo/:pid', productPhotoController)

// delete product
productRoutes.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController)

// update product
productRoutes.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

// Filter product
productRoutes.post('/product-filters', productFilterController);

// product count
productRoutes.get('/product-count', productCountController);

// product per page
productRoutes.get('/product-list/:page',productListController);

// search product
productRoutes.get('/search/:keyword',searchProductController);

// similar product
productRoutes.get('/related-product/:pid/:cid',relatedProductController);

// category wise product
productRoutes.get('/product-category/:slug',productCategoryController);

// payment routes-------------------------

// token
productRoutes.get('/braintree/token', braintreeTokenController);

// payments
productRoutes.post('/braintree/payment', requireSignIn, braintreePaymentController);




export default productRoutes