const Joi = require('joi')
const Product = require('../models/Product')
const ProductDto = require('../dto/productDto')
const {BASE_URL} = require('../config/index')
const fs = require('fs')
const IdPattern = /^[a-fA-F0-9]{24}$/

const showAllProducts = async(req,res,next) => {
    let products, totalItem;
    let query = Product.find({})
    let total = Product.find({})
    const {category, brand, _sort, _order, _page, _limit} = req.query
    if(_sort && _order){
        query.sort({[_sort]:_order})
    }
    if(category){
        query.where('category').in(category.split(','))
        total.where('category').in(category.split(','))
    }
    if(brand){
        query.where('brand').in(brand.split(','))
        total.where('brand').in(brand.split(','))
    }
    if(_page && _limit){
        query.skip((_page - 1)* _limit).limit(_limit)
    }
    try {
        [products, totalItem] = await Promise.all([query.exec(), total.count().exec()])
    } catch (error) {
        return next(error)
    }
    products = products.map((item)=> new ProductDto(item))
    res.status(200).json({msg:"Show all products", products, totalItem  })
}
const getAllProducts = async(req,res,next) => {
    let products
    try {
        products =await Product.find({})
    } catch (error) {
        return next(error)
    }
    products = products.map((item)=> new ProductDto(item))

    res.status(200).json({msg:"Show all products",products})
}

const showProductById = async(req,res,next) => {
    let product;
    const {_id} = req.params
    try {
        product = await Product.findOne({_id})
    } catch (error) {
        return next(error)
    }

    res.status(200).json({msg:"Show product by Id",product: new ProductDto(product)})
}
const createProduct = async(req,res,next) => {
    const createProductSchema = Joi.object({
        name: Joi.string().required(),
        company: Joi.string().required(),
        category: Joi.string().required(),
        isFeatured: Joi.boolean().default(false),
        rating: Joi.number().default(0),
        reviews: Joi.number().default(0),
        discount: Joi.number().default(0),
        price: Joi.number().default(0),
        variations: Joi.array().items(Joi.object().keys({
            color: Joi.string().required(),
            stock: Joi.number().required()
          }))
    })
    const {error} = createProductSchema.validate(req.body)
    if(error){
        return next(error)
    }
    const {name, company, category, variations, isFeatured, rating, reviews, discount, price} = req.body

    const files = req.files
    let imagesArray = []
    if(files){
        files.forEach((file) => {
            path = `${BASE_URL}/${file.path}`
            imagesArray.push(path)
        });
    }

    const newProduct = new Product({
        name,
        company,
        category,
        isFeatured,
        images: imagesArray,
        rating,
        reviews,
        discount,
        price,
        variations
    })
    let product;
    try {
        product = await newProduct.save()
    } catch (error) {
        return next(error)
    }
    res.status(200).json({msg:"Product Saved", product: new ProductDto(product)})
}
const updateProduct = async(req,res,next) => {
    const updateProductSchema = Joi.object({
        name: Joi.string(),
        company: Joi.string(),
        category: Joi.string(),
        isFeatured: Joi.boolean(),
        rating: Joi.number(),
        reviews: Joi.number(),
        discount: Joi.number(),
        price: Joi.number(),
        variations: Joi.array().items(Joi.object().keys({
            color: Joi.string(),
            stock: Joi.number()
          }))
    })
    const {error} = updateProductSchema.validate(req.body)
    if(error){
        return next(error)
    }
    const {id} = req.params
    const {name, company, category, variations, isFeatured, rating, reviews, discount, price} = req.body
    const files = req.files
    let product,imagesArray;
        try {
            product = await Product.findOne({_id:id})
        } catch (error) {
            return next(error)
        }

        if (files) {
            imagesArray = product.images.length === 0 ? [] : product.images;
            if (imagesArray.length !== 0) {
                imagesArray.forEach((url) => {
                    const regex = /assets\/.*/;
                    let path = regex.exec(url)
                    fs.unlink(path[0], (err) => {
                        if (err) {
                          if (err.code === 'ENOENT') {
                            console.log('File does not exist.');
                          } else {
                            console.error('Error deleting the file:', err);
                          }
                        } else {
                          console.log('File deleted successfully.');
                        }
                      });
                })
        }
        imagesArray = []
        files.forEach((file) => {
            path = `${BASE_URL}/${file.path}`
            imagesArray.push(path)
        });
    }
    try {
        await Product.updateOne({ _id: id },
            {
                name,
                company,
                category,
                isFeatured,
                images: imagesArray,
                rating,
                reviews,
                discount,
                price,
                variations
            })
    } catch (error) {
        return next(error)
    }
    res.status(200).json({msg:"Product Updated"})

}
const deleteProductById = async(req,res,next) => {
    const deleteBlogSchema = Joi.object({
        id: Joi.string().regex(IdPattern).required()
    });
    const {error} = deleteBlogSchema.validate(req.params)
    if(error){
        return next(error)
    }
    const {id} = req.params

    try {
        await Product.deleteOne({_id:id})
    } catch (error) {
        return next(error)
    }
    res.status(200).json({msg:"Product deleted"})
}
const deleteManyProduct = async(req,res,next) => {

}

module.exports = {
    showAllProducts,
    getAllProducts,
    showProductById,
    createProduct,
    updateProduct,
    deleteManyProduct,
    deleteProductById,
}