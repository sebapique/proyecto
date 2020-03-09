const router = require('express').Router();
const Post = require('../models/Post')
const Answer = require('../models/Answer')
const League = require('../models/League')
const User = require('../models/User')
const { isAuthenticated } = require('../helpers/auth')
const mongoose = require('mongoose')
const flash = require('connect-flash')


//Menu principal de grupos
router.get('/league', isAuthenticated, async (req, res) => {
    res.render('league/menu');
})

router.get('/league/create', isAuthenticated, (req, res) => {
    res.render('league/create')
});

router.post('/league/add', isAuthenticated, async (req, res) => {
    const { name } = req.body;
    const newLeague = new League({ name })
    await newLeague.save();
    await League.findByIdAndUpdate(newLeague.id, { $push: { users: { friend: req.user.name, points: 0 } } })
    const ruta = '/league/standings/' + newLeague.id;
    res.redirect(ruta)
})
router.get('/league/standings/:id', isAuthenticated, async (req, res) => {
    const league = await League.findById(req.params.id);
    res.render('league/standings', { league })
})
router.get('/league/join', isAuthenticated, (req, res) => {
    res.render('league/join')
});

router.post('/league/join', isAuthenticated, async (req, res) => {
    const { identification } = req.body;
    const errors = []
    if (mongoose.Types.ObjectId.isValid(identification)) {
        const league = League.findById(identification)
        
        if (league) {
            await League.findByIdAndUpdate(identification, { $push: { users: { friend: req.user.name, points: 0 } } })
            res.redirect('/league')
        }
        else{
            errors.push({text: 'That league does not exist'})
            res.redirect('/league/join')
        }
    }
    else {
        errors.push({text: 'That league does not exist'})
        res.redirect('/league/join')
    }
});





module.exports = router;