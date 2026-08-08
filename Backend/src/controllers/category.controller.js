import categoryModel from "../models/category.model.js";

export async function createCategory(req , res){
    const {name , image} = req.body;

    if(!name){
        return res.status(400).json({
            "message":"category name is required"
        })
    };

    const smallCaseName = name.trim().toLowerCase();

    const existingCategory = await categoryModel.findOne({name : smallCaseName});
    if(existingCategory){
        return res.status(409).json({
            message:"Category already exist",
        });
    };

    const category = await categoryModel.create({name : smallCaseName , image});

    res.status(201).json({
        message:"Category created Successfully",
        category
    })

}


export async function getCategories(req, res) {
    const categories = await categoryModel.find({isActive : true,},'name _id');

    res.status(200).json({
        "message":"categories are returned",
        "count":categories.length,
        categories
    })

    
}


export async function getCategory(req, res) {
    const {id} = req.params;

    const category = await categoryModel.findById(id);
    if(!category){
        return res.status(404).json({
            "message":"category not found, Invalid Id"
        })
    }

    res.status(200).json({
        "message":"category fetched successfully",
        category
    })
    
}


export async function updateCategory(req, res){
    const {id} = req.params;
    const {name , image} = req.body;
 
    const category = await categoryModel.findById(id);

    if(!category){
        return res.status(404).json({
            "message":"Invalid Id. category not found"
        })
    }

    if(name){
        category.name = name.trim().toLowerCase();
    }

    if(image){
        category.image = image;
    }

    await category.save();

    res.status(200).json({
        "message":"category updated successfully",
        category
    })


}

export async function deleteCategory(req, res){
    const {id} = req.params;

    const category = await categoryModel.findById(id);

    if(!category){
        return res.status(404).json({
            "message":"Category not Found, Invalid Id!"
        })
    }

    if(!category.isActive){
        return res.status(400).json({
            "message":"Product already deleted"
        })
    } 



    category.isActive = false;

    await category.save();

    res.status(200).json({
        "messsage":"category successfully removed",
        category,
    })

}




