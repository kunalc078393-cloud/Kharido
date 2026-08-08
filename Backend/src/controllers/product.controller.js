import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js"; 

export async function createProduct(req, res) {
    const {name , description , price , images , stock , brand , category } = req.body;

    if(
        !name ||
        !description ||
        price === undefined ||
        stock === undefined ||
        !category
    ){
        return res.status(400).json({
            "message":"appropriate product information is required"

        });
    }

    const existingCategory = await categoryModel.findById(category);
    if(!existingCategory){
        return res.status(404).json({
            "message":"category not found"
        })
    }

    const smallCaseName = name.toLowerCase();
    const smallCaseDescription = description.toLowerCase();
    const smallCaseBrand = brand.toLowerCase();


    const existingProduct = await productModel.findOne({name : smallCaseName , description : smallCaseDescription, price , stock , category , brand : smallCaseBrand });

    if(existingProduct){
        return res.status(409).json({
            "message":"product already exist "
        })
    }

    const product = await productModel.create({
        name,
        description,
        brand,
        price ,
        stock,
        images,
        category
    });

    res.status(201).json({
        "message":"product successfully created",
        product
    })



    
}

export async function getProducts(req, res){
    const {search , category , minPrice , maxPrice , sort ="newest" , page=1, limit = 10} = req.query;

    const filter = {
        isActive : true
    };

    if(search){
        filter.name = {
            $regex : search,
            $options : "i"
        }
    }

    if(category){
        filter.category = category;
    }

    if(minPrice){
        filter.price = {
            ...filter.price,
            $gte:Number(minPrice)
        }
    }

    if(maxPrice){
        filter.price = {
            ...filter.price,
            $lte:Number(maxPrice)
        };
    }

    

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if(pageNumber == NaN || pageNumber < 1){
        return res.status(400).json({
            "message":"Invalid Page Number"
        })
    }

    if(limitNumber == NaN || limitNumber < 1 || limitNumber > 100){
        return res.status(400).json({
            "message":"Invalid Limit Number"
        })
    }

    const skip = (pageNumber - 1)* limitNumber ;

    const allowedSorts =[
        "price_asc",
        "price_desc",
        "newest"
    ]

    if( !allowedSorts.includes(sort)){
        return res.status(400).json({
            "message":"Invalid sort option"
        })
    }

    let sortOption = {};

    if(sort == "price_asc"){
        sortOption.price = 1;

    }else if(sort == "price_desc"){
        sortOption.price = -1;

    }else if(sort === "newest"){
        sortOption.createdAt = -1;
    }


    const products = await productModel.find(filter).sort(sortOption).skip(skip).limit(limitNumber).populate('category','name');
    if(!products){
        return res.status(404).json({
            "message":"No Product found"
        })
    }
    res.status(200).json({
        message:"products fetched successfully",
        count : products.length,
        products
    })

}

export async function getProductsById(req, res){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            "message":"Id is required"
        })
    }

    const product = await productModel.findById(id).populate('category');

    if(!product){
        return res.status(404).json({
            message: "Product not found, Invalid ID."
        })
    }

    if(!product.isActive){
        return res.status(400).json({
            "message":"Product is already deleted"
        })
    }

    res.status(200).json({
        "message":"product fetched successfully",
        product
    })
}

export async function updateProduct(req, res){
    const {id} = req.params;

    const {name , description , price , brand, stock , images , category} = req.body;

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            "message":"Product not found",
        })
    }

    if(name != undefined){
        product.name = name 
    }

    if(description != undefined){
        product.description = description
    }

    if(price !=  undefined){
        product.price = price
    }

    if(brand != undefined){
        product.brand = brand;
    }

    if(images != undefined){
        product.images = images;
    }

    if(stock != undefined){
        product.stock = stock;
    }
    
    if(category){
        const existingCategory = await categoryModel.findById(id);
        if(existingCategory){
            return res.status(404).json({
                "message":"category not found",
            });
        }
        product.category = category;
    }



    await product.save();

    return res.status(200).json({
        "message":"Product successfully updated",
        product
    })
    
}

export async function deleteProduct(req, res){
    const {id} = req.params;

    const product = await productModel.findById(id);
    if(!product){
        return res.status(404).json({
            "message":"Invalid Id"
        })
    }

    if(!product.isActive){
        return res.status(400).json({
            "message":"product is already deleted"
        })
    }

    product.isActive = false;
    await product.save();

    return res.status(200).json({
        "message":"product deleted successfully"
    });
}