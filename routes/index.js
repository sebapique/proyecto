const router = require('express').Router();

router.get('/',(req,res)=>{
    if(req.user){
        res.redirect('/posts/ask')
    }
    else{
        res.redirect('/user/signin')
    }
    
})

router.get('/about',(req,res)=>{
    res.render('about')
})
module.exports = router;
