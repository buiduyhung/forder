
require('dotenv').config() // npm i dotenv --save
const express = require('express');
const morgan = require('morgan'); // là một middleware logging dùng để ghi lại các thông tin về các yêu cầu HTTP vào console hoặc vào file log
const { default: helmet } = require('helmet'); // ngăn chặn bên thứ 3 lấy thông tin web
const compression = require('compression'); // dùng để nén dữ liệu HTTP trong quá trình truyền tải từ server tới client
const cors = require('cors');
const app = express();

app.use(cors())

// init middleware
app.use(morgan('dev'))
// app.use(helmet())
// app.use(compression)
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// app.use(morgan('combined'))
// app.use(morgan('compile'))
// app.use(morgan('common'))
// app.use(morgan('short'))
// app.use(morgan('tiny'))
// app.use(morgan('dev'))

// init database
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init routes
app.use('/', require('./routes'))

// error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack, //debug
        message: error.message || 'Internal Server Error'
    })
    
})

module.exports = app;