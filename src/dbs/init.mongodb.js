'use strict';

const mongoose = require('mongoose');
const { db: {host, name, port} } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require('../helpers/check.connect') 

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb') {
        // Enable mongoose debugging if in development mode
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString)
            .then(() => {
                console.log(`connectString:`, connectString);
                console.log(`Connected to MongoDB successfully`, countConnect());
            })
            .catch(err => console.error('Error connecting to MongoDB:', err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
