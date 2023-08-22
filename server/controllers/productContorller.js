const Joi = require('joi')
const Product = require('../models/Product')
const ProductDto = require('../dto/productDto')
const { BASE_URL } = require('../config/index')
const fs = require('fs')
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
    console.log("🚀 ~ file: productContorller.js:58 ~ createProduct ~ req.body:", req.body)
    console.log("🚀 ~ file: productContorller.js:58 ~ createProduct ~ req.files:", req.files)

    const createProductSchema = Joi.object({
        title: Joi.string().required(),
        brand: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        discountPercentage: Joi.number().default(0),
        price: Joi.number().required(),
        stock: Joi.number().required(0),
        thumbnail: Joi.string().required(),
        images: Joi.array()
    })
    const { error } = createProductSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    const { title, brand, category, discountPercentage, price, stock, description, thumbnail, images } = req.body

    const thumbnailBuffer = Buffer.from(thumbnail.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
    const thumbnailPath = `assets/${Date.now()}-${title}.png`
    //  storing thumbnail
    try {
        fs.writeFileSync(thumbnailPath, thumbnailBuffer)
    } catch (error) {
        return next(error)
    }
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
    const { error } = updateProductSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    const { id } = req.params
    const { name, company, category, variations, isFeatured, rating, reviews, discount, price } = req.body
    const files = req.files
    let product, imagesArray;
    try {
        product = await Product.findOne({ _id: id })
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