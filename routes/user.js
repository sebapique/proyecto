const router = require('express').Router();
const passport = require('passport');
const flash = require('connect-flash')
const User = require('../models/User')
const { isAuthenticated } = require('../helpers/auth')

//pantalla de inicio de sesion
router.get('/user/signin',(req,res)=>{
    res.render('users/signin')
})
//accion de iniciar sesion
router.post('/user/signin', passport.authenticate('local', {
    successRedirect: '/posts/ask',
    failureRedirect : '/user/signin',
    failureFlash: true
}))

//pantalla de regustro
router.get('/user/signup',(req,res)=>{
    res.render('users/signup')
})
//registro
router.post('/user/signup',async (req,res)=>{
    const {user_name, email, password, confirm_password,gender} = req.body;
    const name = user_name;
    const errors = []
    const points = 3
    const newUser= new User({name,email,password,points,gender})
    if(password != confirm_password){
        errors.push({text: 'Passwords do not match'})
    }
    if(password.length < 4){
        errors.push({text: 'Passwords do not match'})
    }
    if(!email){
        errors.push({text: 'Please add an email'})
    }
    if(!user_name){
        errors.push({text: 'Please add a username'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email,password, confirm_password})
    }
    else{
        
        const emailuser = await User.findOne({email: email})
        if(emailuser){errors.push({text:'Please try another email'})}
        else{
            const username = await User.findOne({name: name})
            if(username){
                errors.push({
                    text:'Please try another username'
                })
            }
            else{
                newUser.password = await newUser.encryptPassword(password)
                await newUser.save()
                req.flash('success_msg', 'Estas Registrado, Inicia Sesion Porfavor ')
                res.redirect('/user/signin')
            }
        }
    }
})
//cerrar sesion
router.get('/user/logout',isAuthenticated,(req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/user/signin');
  });



module.exports = router;