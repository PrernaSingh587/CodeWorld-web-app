exports.authCheck = (req,res,next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    next();
}

exports.adminCheck =(req,res,next) => {
    if(req.session.user.email !== 'prerna.singh587@gmail.com')
        return res.redirect('/dashboard');
        next();
}