const router = require('express').Router();
const Post = require('../models/Post')
const League = require('../models/League')
const Answer = require('../models/Answer')
const User = require('../models/User')
const { isAuthenticated } = require('../helpers/auth')
const mongoose = require('mongoose')
const flash = require('connect-flash')
var preguntas_respondidas = 0;
const nodemailer = require('nodemailer')
//transporter de nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'couragemakeithappen@gmail.com',
        pass: 'RiverPlateEnLaSudamericana1998'
    }
})


//escribir una pregunta
router.get('/posts/ask', isAuthenticated, (req, res) => {
    res.render('posts/ask')
})
//Enviar la pregunta
router.post('/posts/send', isAuthenticated, async (req, res) => {
    const { text, cost } = req.body;
    const errors = [];
    const newpoint = req.user.points - cost
    if (!text) {
        errors.push({ text: 'Please add text' })
    }
    if (newpoint < 0) {
        errors.push({ text: 'Not enough points' })
    }
    if (errors.length > 0) {
        res.render('posts/ask', {
            errors,
            text
        });
    }
    else {
        const user = req.user.name
        const gender = req.user.gender

        await User.update(
            { name: req.user.name },
            { points: newpoint }
        ).then((rawResponse) => {

        })
            .catch((err) => {
                console.log('Hay un error')
            });
        const newNote = new Post({ user, gender, text, cost })
        await newNote.save();
        res.redirect('/posts/ask/all')
    }
}
)

//aca van todas las preguntas y cuando las abris ves sus respuestas
router.get('/posts/ask/all', isAuthenticated, async (req, res) => {
    const questions = await Post.find({ user: req.user.name, answered: false })
    res.render('posts/myqs', { questions })
})
//Aca ves las respuestas de una de tus preguntas
router.post('/posts/ask/:id', isAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.redirect('/posts/ask/all')
    }
    else {
        const answer = await Answer.find({ question: mongoose.Types.ObjectId(req.params.id) })
        res.render('posts/viewans', { post, answer })
    }
})

//Aca es cuando seleccionas una respuesta
router.post('/posts/ask/select/:id', isAuthenticated, async (req, res) => {
    const answer = await Answer.findById(req.params.id)
    const post = await Post.findById(answer.question)
    const query = answer.courager
    const usuario = await User.findOne({ name: query })
    const value = post.cost + usuario.points;

    await User.update(
        { name: query },
        { points: value }
    ).then((rawResponse) => {

    })
        .catch((err) => {
            console.log('Hay un error')
            console.log(err)
        });
    await Post.findByIdAndUpdate(answer.question, { answered: true }, function (err, model) {
        if (err) {
            console.log(err)
        }
    })
    req.flash('success_msg', 'You have sent the coins to the best user.');
    preguntas_respondidas = preguntas_respondidas + 1;//contador universal de cantidad de respuestas exitosas tipo la que sale en la pelicula de facebook
    let mailOptions = {
        from: 'Courage Inc <couragemakeithappen@gmail.com>',
        to: usuario.email,
        subject: 'Your answer was chosen the best!',
        text: 'Hi ' + '@'+usuario.name + ' we wanted you to know that you won the points. Go enjoy them on courager.co. The answer:'+answer.text
    }
    await transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log('Error: ',err)
        }
        else{
            console.log('Message sent')
        }
    })

    res.redirect('/posts/ask/all')
})

//Ver todas las preguntas viejas
router.get('/posts/ask/old', isAuthenticated, async (req, res) => {
    const questions = await Post.find({ user: req.user.name, answered: true })
    res.render('posts/oldqs', { questions })
})
//Abrir una de las preguntas viejas para ver sus respuestas
router.post('/posts/ask/old/:id', isAuthenticated, async (req, res) => {
    const question = await Post.findById(req.params.id)
    const answers = await Answer.find({ question: mongoose.Types.ObjectId(req.params.id) })
    res.render('posts/oldans', { answers, question })
})
//Resuelve el problema de recargar la pagina 
//cuando estas leyendo una pregunta vieja
router.get('/posts/ask/old/:id', isAuthenticated, async (req, res) => {
    res.redirect('/posts/ask/old')
})
//Es para ver cuantas preguntas se hicieron en total 
router.get('/posts/happy', isAuthenticated, (req, res) => {
    const objeto = { numero: preguntas_respondidas }
    res.render('posts/happy', { objeto })
})


module.exports = router;