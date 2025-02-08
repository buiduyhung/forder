'use strict'

const _ = require('lodash')

const getInfoData = ({ files = [], object = {} }) => {
    return _.pick( object, files )
}

module.exports = { 
    getInfoData 
}