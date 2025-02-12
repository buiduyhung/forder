'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'shop' },
    product_atributes: { type: Schema.Types.Mixed, required: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    
}, {
    timestamps: true,
    collection: 'clothings'
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    
}, {
    timestamps: true,
    collection: 'electronics'
})


//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema),
}