const express = require('express');
const model = require('./model.js');

const router = express.Router();

router.get('/', (req, res)=>{
    if(req.session.active_id){
        res.redirect('/index');
    }
    else{
        res.redirect('/login');
    }
})

router.get('/login', (req, res)=>{
    //req.session.active_id = 1;
    if(req.session.active_id){
        res.redirect('/index');
    }else{
        res.render('login');
    }
})

router.post('/login', (req, res)=>{
    console.log(req.body);
    model.login_validation(req.body)
    .then((ret)=>{
        console.log(ret);
        req.session.active_id = ret.Id;
        res.redirect('/')
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('/');
    })
})

router.get('/index', (req, res)=>{
    if(req.session.active_id){
        model.get_all_books()
        .then((books)=>{
          //  console.log(books);
            res.render('index', {data:books});
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    else{
        res.redirect('/login');
    }
})

router.post('/book', (req, res)=>{
    console.log(req.body);
    model.get_reviews(req.body)
    .then((reviews)=>{
        res.render('book', {book:req.body, reviews:reviews});
    })
    .catch((err)=>{
        console.log(err);
    })
})

router.post('/post', (req, res)=>{
    console.log(req.body);
    model.add_review(req.body, req.session.active_id)
    .then((msg)=>{
        console.log(msg);
        res.redirect('/index');
    })
})

router.get('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;