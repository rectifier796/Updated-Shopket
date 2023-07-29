import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//create category
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(201).send({
                success: false,
                message: 'Name is required!!!'
            })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(201).send({
                success: false,
                message: 'Category Already Exist'
            });
        }

        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();

        return res.status(201).send({
            success: true,
            message: "new category created",
            category
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

// update category
export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        return res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            error,
            message:"Error while updating category"
        })
    }
}

//get all category
export const categoryController = async(req,res)=>{
    try{
        const category=await categoryModel.find({});
        return res.status(200).send({
            success:true,
            message:"All Categories List",
            category
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
    }
}

//get single category
export const singleCategoryController=async(req,res)=>{
    try{
        const category=await categoryModel.findOne({slug:req.params.slug});
        if(!category){
            return res.status(401).send({
                success: false,
                message: "No Category Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Fetched Successfully",
            category
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            error,
            message:"Error while getting single category"
        })
    }
}

//delete category
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id} = req.params;
        const data = await categoryModel.findByIdAndDelete(id);
        if(!data){
            return res.status(401).send({
                success: false,
                message: "No Category Found!!!"
            })
        }
        return res.status(200).send({
            success:true,
            message:"Category Deleted Successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error while deleting category",
            error
        })
    }
}