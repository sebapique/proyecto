const router = require('express').Router();
const Post = require('../models/Post')
const Answer = require('../models/Answer')
const User = require('../models/User')
const { isAuthenticated } = require('../helpers/auth')
const nodemailer = require('nodemailer')
//transporter de nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ejmplo@gmail.com',
        pass: 'ejemplo'
    }
})

//Ver todas las preguntas que se pueden responder
router.get('/posts/answer', isAuthenticated, async (req, res) => {
    const posts = await Post.find({ answered: false }).where("user").ne(req.user.name)
    res.render('posts/answer', { posts })
})
//Aca es cuando abris para responder
router.post('/posts/answer/:id', isAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id).sort('number')

    if ((!post) || (post.answered)) {
        res.redirect('/posts/answer')
    }
    else {
        res.render('posts/send', { post })
    }
})
//Arregla problema de recargar la pagina
router.get('/posts/answer/:id', isAuthenticated, async (req, res) => {
    res.redirect('/posts/answer')
})

//Aca es cuando mandas la respuesta
router.post('/posts/answer/send/:id', isAuthenticated, async (req, res) => {
    const { answer } = req.body;
    const errors = []
    if (!answer) {
        errors.push({ text: 'Please add text' })
    }
    console.log(errors)
    console.log(answer)
    if(errors.length>0){
        res.render('/posts/answer');
    }
    else {
        const question = req.params.id
        const text = answer;
        const courager = req.user.name
        const newAnswer = new Answer({ question, text, courager })
        const query = await Post.findByIdAndUpdate(question, { $inc: { number: 1 } })
        const usuario = await User.findOne({ 'name': query.user })
        await newAnswer.save();
        let mailOptions = {
            from: 'Courage inc <ejemplo@gmail.com>',
            to: usuario.email,
            subject: 'You have received a new answer to your question!',
            html: 'Hey there ' + '@' + usuario.name + ' you have received a new answer to your question, go check it out on courager.co . Remember you have to select which is the best answer. Follow us on Instagram: @thecourageapp'
        }
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('Error: ', err)
            }
            else {
                console.log('Message sent')
            }
        })
        res.redirect('/posts/answer')
    }
})

module.exports = router;