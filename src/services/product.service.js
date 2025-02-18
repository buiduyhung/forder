"use strict";

// const ProductFactory = require("../factories/product.factory");
const ProductFactory = require("../factories/product.factory.xxx")

class ProductService {
    static async createProduct(type, payload) {
        return await ProductFactory.createProduct(type, payload);
    }
}

module.exports = ProductService;
