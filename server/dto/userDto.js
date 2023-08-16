class UserDto{
    constructor(user){
        this.email = user.email
        this.username = user.username
        this.id = user._id
        this.shippingAddresses = user.shippingAddresses ||  []
        this.favourites = user.favourites || []
        this.role = user.role
    }
}

module.exports = UserDto