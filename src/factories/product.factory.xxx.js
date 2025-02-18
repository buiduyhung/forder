"use strict";

const { product, clothing, electronic, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

// Define factory class to create product
class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef) {
        this.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        
        return new productClass(payload).createProduct()
    }
}

// Define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_atributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_atributes = product_atributes
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

// Define subclass for Clothing products
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_atributes)
        if (!newClothing) throw new BadRequestError("Failed to create clothing")

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError("Failed to create product")

        return newProduct;
    }
}

// Define subclass for Electronic products
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_atributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError("Failed to create electronic")

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError("Failed to create product")

        return newProduct;
    }
}

// Define subclass for Furniture products
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_atributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError("Failed to create furniture")

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError("Failed to create product")

        return newProduct;
    }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;
