const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/proyecto',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify: false
})
  .then(db => console.log('DB ON'))
  .catch(err => console.log(err));

