import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import braintree from 'braintree';
import dotenv from "dotenv";

dotenv.config();

// payment credential
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

// create product
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shippping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' });
            case !description:
                return res.status(500).send({ error: 'Description is Required' });
            case !price:
                return res.status(500).send({ error: 'Price is Required' });
            case !category:
                return res.status(500).send({ error: 'Category is Required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' });
            case !photo:
                return res.status(500).send({ error: 'Photo is Required' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Required and should be less then 1mb' });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        return res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: "Error while creating product"
        })
    }
}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "All Products",
            totalcount: products.length,
            products
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting products',
            error: error.message
        })
    }
}

// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");

        return res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            messgae: "Error while getting single product",
            error
        })
    }
}

// get product photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while fetching photo",
            error
        })
    }
}

// delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting product"
        })
    }
}

// update product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shippping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' });
            case !description:
                return res.status(500).send({ error: 'Description is Required' });
            case !price:
                return res.status(500).send({ error: 'Price is Required' });
            case !category:
                return res.status(500).send({ error: 'Category is Required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Required and should be less then 1mb' });
        }

        console.log(req.params.pid);

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        return res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while updating product"
        })
    }
}

// filter product
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0)
            args.category = checked;

        if (radio.length)
            args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await productModel.find(args);

        return res.status(200).send({
            success: true,
            message: "Filter Applied",
            products
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            error: message.error,
            message: "Error While Filtering Products"
        })
    }
}

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        return res.status(200).send({
            success: true,
            total,
            message: "Total Count of Products"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in Product Count",
            success: false,
            error: error.message
        })
    }
}

// product per page
export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            products,
            message: `Products of Page Number ${page} fetched`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in Product Per Page",
            success: false,
            error: error.message
        })
    }
}

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");

        res.json(results);
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error: error.message
        })
    }
}

// similar product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;

        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },
        })
            .select("-photo")
            .limit(3)
            .populate("category");

        return res.status(200).send({
            success: true,
            message: "Related Products Fetched",
            products
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error While Getting Related Product",
            error: error.message
        })
    }
}

// get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(300).send({
                success: false,
                message: "No Category Found"
            })
        }
        const products = await productModel.find({ category }).populate("category");
        return res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            error: error.message,
            message: 'Error While Getting Category Wise Products'
        })
    }
}

// payment gateway api
// token
export const braintreeTokenController = async (req, res) => {
 try {
    gateway.clientToken.generate({}, function(err,response){
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        else{
            res.send(response);
        }
    })
 } catch (error) {
    console.log(error);
    return res.status(500).send({
        error:error.message
    })
 }
}

// payment
export const braintreePaymentController = async (req, res) => {
    try{
        const {cart, nonce} = req.body;
        let total = 0;
        cart.map((i)=>{
            total += i.price;
        })
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
                const order = new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id
                }).save();
                res.json({ok:true});
            }
            else{
                console.log(error);
                res.status(500).send(error);
            }
        }
        )
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            error:error.message
        })
    }
}