const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://mevadajay2002:'+
    process.env.MONGO_ATLAS_PW+
    '@cluster0.y36kdos.mongodb.net/?retryWrites=true&w=majority'
);

mongoose.Promise = global.Promise;

app.use('/uploads',express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPRIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


// routes which should handdle the request
app.use('/products',productRoutes); 
app.use('/orders',orderRoutes); 
app.use('/user',userRoutes);


app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;