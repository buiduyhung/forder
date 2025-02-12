"use strict";

const ProductFactory = require("../factories/product.factory");

class ProductService {
    static async createProduct(type, payload) {
        return await ProductFactory.createProduct(type, payload);
    }
}

module.exports = ProductService;
