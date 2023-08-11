class ProductDto{
    constructor(product){
        this._id = product._id
        this.title = product.title
        this.description = product.description
        this.brand = product.brand
        this.category = product.category
        this.thumbnail = product.thumbnail
        this.images = product.images
        this.price = product.price
        this.discountPercentage = product.discountPercentage
        this.isFeatured = product.isFeatured
        this.rating = product.rating
        this.reviews = product.reviews
        this.stock = product.stock
        this.variations = product.variations

    }
}

module.exports = ProductDto