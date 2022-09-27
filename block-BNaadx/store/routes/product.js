var express = require('express');
const Admin = require('../models/admin');
const User = require('../models/user');

const product = require('../models/product');
var router = express.Router();
const Product = require('../models/product');

/* GET -- Load Product Page */

router.get(`/add`, function(req, res, next){
    res.render(`productCreate`)
})

/* POST - Product Added */

router.post(`/add`, function(req, res, next){
    Product.create(req.body, (err, user) => {
        if (err) next(err)
        req.flash(`success`, `Product Added Successfully`)
        res.redirect(`/product`)
    })
  })


  /* GET - All Products */

router.get(`/`, function(req, res, next){
    Product.find({}, (err, products) => {
        if(err) next(err)
        res.render(`productAll`, {products})
    })
  })


    /* GET - SINGLE Products */

    router.get(`/:id`, function(req, res, next) {
        let id = req.params.id
        Product.findOne({_id: id}, (err, product) => {
            if(err) next(err);
            console.log(product, "Single Product Found")
            let message = req.flash(`message`)[0]
            res.render(`productSingle`, {product, message})
        })
    } )

/* GET - LIKING A PRODUCT */

router.get(`/:id/like`, function(req, res, next) {
    let id = req.params.id
    Product.findOneAndUpdate({_id: id}, {$inc: {likes: 1}}, (err, product)=> {
    if(err) next(err)
    console.log(product, "Liked Product")
     res.redirect(`/product/${id}`)
    })
})

/* GET - Adding Product To Cart */

router.get(`/:id/cart`, function(req, res, next) {
    let id = req.params.id
    // var cart = req.session.cart || [];  
   let name = req.session.name

    User.findOneAndUpdate({fname: name}, {$push: {cart: id}}, (err, user) => {
        if(err) next(err);
        console.log(user, "Cart added to User")
        req.flash("message", "Added to cart Successfully")
        res.redirect(`/product/${id}`)
    })
})

















module.exports = router;