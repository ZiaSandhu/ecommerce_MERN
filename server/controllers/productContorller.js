const Joi = require('joi')
const Product = require('../models/Product')
const ProductDto = require('../dto/productDto')
const { BASE_URL } = require('../config/index')
const fs = require('fs')
// const { patch } = require('../routes')
const IdPattern = /^[a-fA-F0-9]{24}$/

const showAllProducts = async (req, res, next) => {
    let products, totalItem;
    let query = Product.find({})
    let total = Product.find({})
    const { category, brand, _sort, _order, _page, _limit } = req.query
    if (_sort && _order) {
        query.sort({ [_sort]: _order })
    }
    if (category) {
        query.where('category').in(category.split(','))
        total.where('category').in(category.split(','))
    }
    if (brand) {
        query.where('brand').in(brand.split(','))
        total.where('brand').in(brand.split(','))
    }
    if (_page && _limit) {
        query.skip((_page - 1) * _limit).limit(_limit)
    }
    try {
        [products, totalItem] = await Promise.all([query.exec(), total.count().exec()])
    } catch (error) {
        return next(error)
    }
    products = products.map((item) => new ProductDto(item))
    res.status(200).json({ msg: "Show all products", products, totalItem })
}
const getAllProducts = async (req, res, next) => {
    let products
    try {
        products = await Product.find({}, 'category and brand')
    } catch (error) {
        return next(error)
    }

    res.status(200).json({ msg: "Show Categories and brand", products })
}

const showProductById = async (req, res, next) => {
    let product;
    const { _id } = req.params
    try {
        product = await Product.findOne({ _id })
    } catch (error) {
        return next(error)
    }

    res.status(200).json({ msg: "Show product by Id", product: new ProductDto(product) })
}
const createProduct = async (req, res, next) => {

    const createProductSchema = Joi.object({
        title: Joi.string().required(),
        brand: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        discountPercentage: Joi.number().default(0),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        thumbnail: Joi.string().required(),
        images: Joi.array()
    })
    const { error } = createProductSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    const { title, brand, category, discountPercentage, price, stock, description, thumbnail, images } = req.body

    const thumbnailBuffer = Buffer.from(thumbnail.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
    let thumbnailPath = `assets/${Date.now()}-${title}.png`
    //  storing thumbnail
    try {
        fs.writeFileSync(thumbnailPath, thumbnailBuffer)
    } catch (error) {
        return next(error)
    }
    thumbnailPath = BASE_URL + thumbnailPath
    let imageArray = []
    images.forEach((item, index) => {
        const imageBuffer = Buffer.from(item.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
        const imagePath = `assets/${Date.now()}-${title}-${index}.png`
        //  storing thumbnail
        try {
            fs.writeFileSync(imagePath, imageBuffer)
        } catch (error) {
            return next(error)
        }
        imageArray.push(`${BASE_URL}/${imagePath}`)
    });
    const newProduct = new Product({
        title, brand, category, discountPercentage, price, stock, description,
        images: imageArray,
        thumbnail: thumbnailPath
    })
    let product;
    try {
        product = await newProduct.save()
    } catch (error) {
        return next(error)
    }
    res.status(200).json({ msg: "Product Saved", product: new ProductDto(product) })
}
const updateProduct = async (req, res, next) => {

    const updateProductSchema = Joi.object({
        title: Joi.string().required(),
        brand: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        discountPercentage: Joi.number().default(0),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        thumbnail: Joi.string().required(),
        images: Joi.array()
    })
    const { error } = updateProductSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    const { id } = req.params
    const { title,
        brand,
        category,
        discountPercentage,
        price,
        stock,
        description,
        thumbnail,
        images } = req.body

    let product, oldThumbnailPath, oldImagesArray;
    try {
        product = await Product.findOne({ _id: id })
    } catch (error) {
        return next(error)
    }
    oldThumbnailPath = product.thumbnail
    oldImagesArray = product.images
    const regex = /\assets\/(.+)/;
    // deleting old thumbnail from memory
    try {
        let match = oldThumbnailPath.match(regex)
        if(match){
            let path = match[0]
            if(fs.existsSync(path)){
                fs.unlinkSync(path)
            }
        }
    } catch (error) {
        return next(error)
    }
    // deleting old images from memory
    try {
        for (let index = 0; index < oldImagesArray.length; index++) {
            let image = oldImagesArray[index];
            let match = image.match(regex)
            if(match){
                let path = match[0]
                if(fs.existsSync(path)){
                    fs.unlinkSync(path)
                }
            }
        }
    } catch (error) {
        return next(error)
    }
    // todo if image or thumbnail contain url instead of base 64 string
    let thumbnailPath
    const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,/;
    if (base64Pattern.exec(thumbnail)) {
        const thumbnailBuffer = Buffer.from(thumbnail.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
        thumbnailPath = `assets/${Date.now()}-${title}.png`
        //  storing thumbnail
        try {
            fs.writeFileSync(thumbnailPath, thumbnailBuffer)
        } catch (error) {
            return next(error)
        }
        thumbnailPath = BASE_URL + thumbnailPath
    }
    else{
        thumbnailPath = thumbnail
    }
    let imageArray = []
    if (base64Pattern.exec(images[0])) {
        images.forEach((item, index) => {
            const imageBuffer = Buffer.from(item.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
            const imagePath = `assets/${Date.now()}-${title}-${index}.png`
            //  storing thumbnail
            try {
                fs.writeFileSync(imagePath, imageBuffer)
            } catch (error) {
                return next(error)
            }
            imageArray.push(`${BASE_URL}/${imagePath}`)
        });
    } else {
        imageArray = [...images]
    }

    try {
        await Product.updateOne({_id:id},{ title,
            brand,
            category,
            discountPercentage,
            price,
            stock,
            description,
            thumbnail: thumbnailPath,
            images:imageArray })
    } catch (error) { 
        return next(error)
    }

    res.status(200).json({ msg: "Product Updated" })

}
const deleteProductById = async (req, res, next) => {
    const deleteBlogSchema = Joi.object({
        id: Joi.string().regex(IdPattern).required()
    });
    const { error } = deleteBlogSchema.validate(req.params)
    if (error) {
        return next(error)
    }
    const { id } = req.params

    try {
        await Product.deleteOne({ _id: id })
    } catch (error) {
        return next(error)
    }
    res.status(200).json({ msg: "Product deleted" })
}
const deleteManyProduct = async (req, res, next) => {

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