const express = require('express');
const morgan = require('morgan'); // là một middleware logging dùng để ghi lại các thông tin về các yêu cầu HTTP vào console hoặc vào file log
const { default: helmet } = require('helmet'); // ngăn chặn bên thứ 3 lấy thông tin web
const compression = require('compression'); // dùng để nén dữ liệu HTTP trong quá trình truyền tải từ server tới client
const app = express();


// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression)

// app.use(morgan('combined'))
// app.use(morgan('compile'))
// app.use(morgan('common'))
// app.use(morgan('short'))
// app.use(morgan('tiny'))
// app.use(morgan('dev'))

// init database

// init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome to the API!'
    })
});

// error handling middleware

module.exports = app;