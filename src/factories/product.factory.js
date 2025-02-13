"use strict";

const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

// Define factory class to create product
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return await new Clothing(payload).createProduct()
            case 'Electronics':
                return await new Electronic(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type: ${type}`)
        }
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

module.exports = ProductFactory;
