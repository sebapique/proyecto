const helpers = {}

helpers.isAuthenticated= (req,res,next)=>{
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('success_msg','Please sign in or sign up');
    res.redirect('/user/signin')
}
module.exports = helpers;