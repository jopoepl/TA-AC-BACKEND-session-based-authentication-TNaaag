var express = require('express');
var router = express.Router();
var Article = require(`../models/article`);
var User = require(`../models/user`)
var Comment = require(`../models/comment`)

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.userId){
        req.flash("message", "Login First")
        res.redirect(`/users/login`)
    } else {
        User.findOne({fname: req.session.name}, (err, user) => {
            console.log(req.session.name, "sess name")
            console.log(user, "USER")
        })
        
        User.findOne({fname: req.session.name}).populate(`article`).exec((err, user)=> {
            console.log(user, "User Found using req sess")
            let articles = user.article
            console.log("ARTICLES", articles)
            res.render(`allArticles`, {articles: articles, name: req.session.name})
        })
    }
});

//ADDING AN ARTICLE

router.get('/add', function(req, res, next) {
    if(!req.session.userId){
        req.flash("message", "Login First")
        res.redirect(`/users/login`)
    } else {
        let session = req.session
        res.render('addArticle', { session});
    }
});


router.post('/add', function(req, res, next) {
    if(!req.session.userId){
        req.flash("message", "Login First")
        res.redirect(`/users/login`)
    } else {
        console.log(req.body, "REQ BODY")
        Article.create(req.body, (err, article) => {
            if(err) next(err)
            console.log("ARticle Author", article.author)
            User.findOneAndUpdate({_id: article.author}, {$push: {article: article._id}}, (err, user) => {
                User.findOne({fname: user.fname}).populate(`article`).exec((err, user)=> {
                    let articles = user.article
                    res.render(`allArticles`, {articles: articles, name: req.session.name})
                })
            })
        })
    }
});


//VIEWING SINGLE ARTICLE

router.get(`/:slug/`, function(req, res, next){
    let link = req.params.slug;
    Article.findOne({slug: link}).populate(`comments`).exec((err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE FOUND-single", article)
        res.render(`articles`, {article})
    })
})


//UPDATING AN ARTICLE

router.get(`/:slug/update`, function(req, res, next){
    let link = req.params.slug;
    Article.findOne({slug: link}, (err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE FOUND", article)
        res.render(`updateArticle`, {article: article, name: req.session.name})
    })
})

router.post(`/:slug/update`, function(req, res, next){
    let link = req.params.slug;
    Article.findOneAndUpdate({slug: link}, req.body, (err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE UPDATED", article)
        res.render(`articles`, {article})
    })
})

//DELETING AN ARTICLE

router.get(`/:slug/delete`, function(req, res, next){
    let link = req.params.slug;
    Article.findOneAndDelete({slug: link}, (err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE DELETED", article)
        res.redirect(`/articles`)
    })
})

//ADDING COMMENTS

// router.get(`/:slug/comment`, function(req, res, next){
//     res.render(`addComment`)
// })


router.post(`/:slug/comment`, function(req, res, next){
    console.log(req.body)
    Comment.create(req.body, (err, comment) => {
        if(err) console.log(err)
        console.log("COMMENT ADDED", comment)
        let articleId = comment.article
        let commentId = comment._id 
        console.log(articleId, commentId, "IDs")
        Article.findOneAndUpdate({_id: articleId}, {$push: {comments: commentId}}, (err, article) => {
            console.log("UPDATED ARTICLE", article)
            res.redirect(`/articles/${article.slug}`)
        })  
    })
})







module.exports = router;
