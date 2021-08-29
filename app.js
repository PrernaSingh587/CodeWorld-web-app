const express = require('express');
const crypto = require('crypto');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const UserModel = require('./models/user');
const Contest = require('./models/contest');
const Blog = require('./models/blog');
const Ques = require('./models/question');
const isAuth = require('./routes/is-auth');
app.use(bodyparser.urlencoded({extended:true}));
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
      auth: {
            api_key: //add new api key from send grid
      }
}))

app.set('view engine', 'ejs');
app.set('views','views');

const bcrypt = require('bcryptjs');

const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const store = new MongoDBStore({
    uri : 'mongodb+srv://Prerna:papa2000@cluster0.vw5ul.mongodb.net/CodeWorld?retryWrites=true&w=majority'
    ,collection: 'sessions'
});
const csrfProtection = csrf();

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({secret:'my secret', resave: false,  cookie: { maxAge: oneDay }, saveUninitialized: false,store: store}))
console.log("I came back up!!");
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
   if(!req.session.user) {
       return next();
   }
   UserModel.findById(req.session.user._id)
.then(user => {
   req.user = user;
   Contest.findOne()
   .then(contest => {
      req.contest = contest
      next();
   })
  
})
.catch(err => console.log(err));
})

app.use((req,res,next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
   
   if(req.session.user)
   res.locals.email = req.session.user.email,
   res.locals.EMAIL = req.session.user.email
   next();
})



/* app.use((req,res,next) => {
   UserModel.findById(req.session.user._id)
   .then(user => {
      req.user = user;
      Contest.findById('5f2da6e314659f0f5db63260').then(contest => {
         req.contest = contest;
         next();
      }).catch(err => console.log(err));
   })
   .catch(err => console.log(err));
}) */

app.get('/write-blog',isAuth.authCheck,(req,res,next) => {
   let edit = req.query.edit;
   if(!edit) edit=false;
  let params = req.query.id;
  if(!params) params=null;
  console.log("paramsssss" , params);
   if(edit)
  { Blog.findById(params).then(result => {
      res.render('write-blog', {
         edit: edit,
         title: result.title,
         desc : result.desc,
         path: '/write-blog',
         params: params,
      });
     
   })
}
else{
   console.log(req.user._id);
   res.render('write-blog' ,{
      edit: false,
      path: '/write-blog',
      params:params,
      userid: req.user._id
   });
}
   
})



app.post('/write-blog',isAuth.authCheck, (req,res,next) => {
   console.log("My blog");
   const title= req.body.title;
    const desc = req.body.desc;
    const date = Date();
    const userid = req.body.userid
    console.log(userid)
    if(req.body.edit === 'true') {
       console.log("dlgjl");
       Blog.findById(req.body.id)
       .then(result => {
          result.title = title;
          result.desc = desc;
         return result.save()
         .then(blog => {
            console.log("Updated blog ",blog);
            res.redirect('/blogs');
         });
        
       })
       .catch(err => {
          console.log(err);
       })
    }
  else  {
     const blog = new Blog ({
       title: title,
       desc: desc,
       date: date,
       userName : req.user.name,
       email: req.user.email,
       like: 0,
       userid: userid
    }); 
    blog.save()
    .then(result => {
     
        let para = '/full-blog/' + result._id;
        console.log('Created a blog ', para);
         res.redirect(para);
    })
    .catch(err => {
       console.log(err);
    })}
})

app.post('/full-blog/:blogId',isAuth.authCheck, (req,res,next) => {
   const params = req.params.blogId;
   const name = req.user.name;
   const userid = req.user._id
   Blog.findById(params).then(result => {
     return result.docomment(req.body.comment,name,userid,Date());
   })
   .then(t => {
      res.redirect('/full-blog/'+params);
   })
   .catch(err => console.log(err));
})


app.get('/full-blog/:blogId',isAuth.authCheck, (req,res,next) => {
   const content  = req.params.blogId;
   console.log("Params: ", content);
   Blog.findById(content).then(result =>{
      if(!result) return res.redirect('/blogs');
      
      res.render('full-blog', {
         title: result.title,
         desc: result.desc,
         date: result.date,
         name: result.userName,
         blogId : content,
         like: result.like,
         userid: result.userid,
         
         comment: result.comment,
         path:'none',
         currentUser : req.user._id.toString()
         
      });
   })
   .catch(err => console.log(err));
  
})

app.use('/like/:blogid',isAuth.authCheck, (req,res,next) =>{
   const blogid = req.params.blogid;
   console.log("blogiddd:  ",blogid);
   Blog.findById(blogid).then(result => {
     console.log(result);
    return result.incLike(blogid,req.user._id.toString());
     
   })
   .then(f => {
      console.log("hogaya");
      res.redirect('/blogs');
   })
   


})


app.get('/profile/:userid',isAuth.authCheck,(req,res,next) => {
   const userid = req.params.userid;
   if(userid === req.user._id.toString())
   {
      return res.redirect('/dashboard')
   }
   let blog;
   console.log(userid,req.user._id)
   Blog.find({userid: userid}).then(result => {
      blog = result;
      UserModel.findById(userid)
      .then(user => {
         
         res.render('profile',{
            path: null,
            name: user.name,
            institution: user.institution,
            branch: user.branch,
            email: user.email,
            currentUser: req.user._id.toString(),
            userid: userid,
            blog: blog,
           
         })
      })
   })

  


})


app.use('/blogs', (req,res,next) => {
   Blog.find()
   .then(blogs => {
     console.log("blogs:: ",blogs);
    res.render('all-blogs', {
       blog: blogs,
       path:'/blogs'
    })
   })
   .catch(err => {
      console.log(err);
   })
} )

app.use('/admin-blog',isAuth.adminCheck,(req,res,next) => {
   Blog.find()
   .then(blogs => {
     console.log("blogs:: ",blogs);
    res.render('admin-blog', {
       blog: blogs
       ,path: '/admin-blog'
    })
   })
   .catch(err => {
      console.log(err);
   })
})

app.use('/delete-blog?', isAuth.authCheck,(req,res,next) =>{
   console.log(req.url);
   const blogid = req.query.blogid;
   console.log(blogid)
   Blog.findByIdAndRemove(blogid).then(result =>{
      console.log('removed');
      res.redirect('/admin-blog');
   })
})

app.get('/problem', isAuth.authCheck,(req,res,next) => {
   let ques;
    Ques.findById('5f366a26aa522029234e025a').then(result =>{
       ques= result;
       console.log(ques)
       res.render('problemset',{
         path: '/problem',
         ques: ques
      })
    }).catch(err => console.log(err));
      
})

app.get('/problem/add/:topic',isAuth.authCheck, (req,res,next) => {
   const topic = req.params.topic;
  // console.log(topic);
   const date= Date();
   const userid = req.session.user._id;

   console.log(userid , "somethinggggggggggg");
   res.render('add-ques',{
      path: null,
      topic: topic,
      date: date,
      userid: userid

   });
})

app.post('/problem/add/:topic',isAuth.authCheck, (req,res,next) => {
   const topic = req.params.topic;
  const link = req.body.link;
  let name;
  const date = req.body.date;
  console.log(date);
  const userid = req.body.userid;
  console.log(userid);
  UserModel.findById(userid).then(result =>{
     name=result.name;
     console.log(result);
     Ques.findById('5f366a26aa522029234e025a').then(t => {
      console.log("question : ",t); 
     t.addQues(link,topic,date,name).then(result=>{
        const url = '/problem/'+topic;
        console.log('/problem/'+topic);
       res.redirect(url)
     }).catch(err =>{
        console.log(err)
     });
    })
  }).catch(err => {
     console.log(err);
  })
 

})


app.use('/problem/:topic',isAuth.authCheck,(req,res,next) => {
   const topic = req.params.topic;
 console.log(topic);
   let questions;
   
   Ques.findById('5f366a26aa522029234e025a').then(result => {
      if(topic === 'arrays')
      questions = result.array;
      else if(topic === 'strings')
      questions = result.strings;
      else if(topic === 'stacks')
      questions = result.stacks;
      else if(topic === 'queues')
      questions = result.queues;
      else if(topic === 'heaps')
      questions = result.heaps;
      else if(topic === 'trees')
      questions = result.trees;
      else if(topic === 'graphs')
      questions = result.graphs;
      else if(topic === 'sorting')
      questions = result.sorting;
      else if(topic === 'searching')
      questions = result.searching;
      else if(topic === 'dp')
      questions = result.dp;
      else if(topic === 'greedy')
      questions = result.greedy;
      else if(topic === 'hashing')
      questions = result.hashing;
      else if(topic === 'bit')
      questions = result.bit;
      else if(topic === 'misc')
      questions = result.misc;

res.render('question/ques',{
   topic : topic.toUpperCase() ,
   params: topic,
   path: null,
   ques: questions
})
   })
   .catch(err => {
      console.log(err);
   })
 
  
})

app.use('/contest', isAuth.authCheck,(req,res,next) => {
   
   res.render('contest', {
      path:'/contest',
      contest : req.contest.upcoming
      
   })
})
app.get('/add-contest',isAuth.adminCheck,(req,res,next) => {
   res.render('add-contest',{
      path: '/contest',
     
   })
})
app.post('/add-contest',isAuth.adminCheck,(req,res,next) => {
   const link = req.body.link;
   const type = req.body.type;
   const date = req.body.date;
   //const duration = req.body.duration;
   const sTime = req.body.stime;
   const eTime = req.body.etime;
  req.contest.addContest(link,type,date,sTime,eTime)
  .then(result => {
     console.log("yaa added!!!!!!")
         res.redirect('/contest');
  })
.catch(err => console.log(err));



})
app.use('/leaderboard',isAuth.authCheck,(req,res,next) => {
   res.render('leaderboard', {
      path:'/leaderboard'
   })
})

app.use('/members',isAuth.authCheck,(req,res,next) => {
UserModel.find()
.then(users => {
   res.render('members', {
      path:'/members',
      users: users
   })
})
.catch(err => console.log(err));

  
})

app.use('/dashboard',isAuth.authCheck,(req,res,next) =>{
   let blog;
   const email = req.user.email
    Blog.find({email: email}).then(result => {
       blog = result;
       res.render('dashboard', {
         name: req.user.name,
         email: req.user.email,
         institution: req.user.institution,
         branch: req.user.branch,
         path: '/',
         blog: blog
      });
    })
 
   
   // next();
 })
 app.get('/login', (req,res,next) => {

   let msg = req.flash('error');
   if(msg.length > 0 )
     msg = msg[0];
     else msg = null;
        res.render('auth/login', 
        { path: '/login',
         title: 'Login',
         isAuthenticated: false,
         error: msg
        }
         );
  console.log(req.session);
 }) 

 app.post('/login',(req,res,next) => {
   const email = req.body.email
   const password = req.body.password
   UserModel.findOne({email: email})
   .then(user => {
       //console.log("USERMODEL",user._id)
       if(!user) {
             req.flash('error','Invalid Email/Password');
         
         return res.redirect('/login');
      }
       bcrypt.compare(password, user.password).then(doMatch => {
             console.log(doMatch);
             if(doMatch) {
               req.session.user = user //new UserModel(user.name,user.email,user.cart, user._id);
               req.session.isLoggedIn = true
            return  req.session.save((err) => {
                    console.log(err);
                    console.log("Yesss");
                    res.redirect('/dashboard');
              })
             }
             else {   req.flash('error','Invalid Email/Password');
                   res.redirect('/login')}
       }).catch(err => {
             console.log(err);
             res.redirect('/login');
       })
       
   })
   .catch(err => console.log(err));
 })



app.post('/logout', isAuth.authCheck,(req,res,next) => {
   req.session.destroy((err) => {
         //console.log(err);
        console.log("yessssssssssssssssssssssss");
         res.redirect('/login');
   })

} ) 



 app.get('/signup', (req,res,next) => {
   let msg = req.flash('error');
   if(msg.length > 0 )
     msg = msg[0];
     else msg = null;
   res.render('auth/signup', {
         path:'/signup',
         title: 'Signup',
       //  isAuthenticated: false
       error: msg
   })

})

app.post('/signup',(req,res,next) => {
   const email = req.body.email;
   const name = req.body.name;
   const insti = req.body.institute;
   const branch = req.body.branch;
   const password = req.body.password;
  
   UserModel.findOne({email: email})
   .then(userDoc => {
         if(userDoc)
         {     req.flash('error','Email already exists');
               return res.redirect('/signup');
         }
         return bcrypt.hash(password, 12).then(hashedPassword => {
               const user = new UserModel({
                     name: name,
                     email: email,
                     institution: insti,
                     branch: branch,
                     password: hashedPassword
               })
               return user.save();
         })
         .then(result => {
               console.log("Hey created")
               res.redirect('/login');
               return transporter.sendMail({
                  to: email,
                  from: 'prerna.singh587@gmail.com',
                  subject: 'SignUp Succeeded!!',
                  html: '<p>Dear User,</p><p>Thank you for registering with <b>CodeWorld</b>. Now you can explore the website, blog, participate in contests, add and solve questions.</p> <br><br>For any queries or issues with the website, mail us at <b><i>prerna.singh587@gmail.com</i></b><br><p>Thank you</p><p>Prerna Singh<br>Admin and Developer,<br>CodeWorld</p>'
            })
         });
        
   })
   
   .catch(err => {
         console.log(err);
   })

})

app.get('/reset/:token', (req,res,next) => {
   const token = req.params.token;
      UserModel.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      .then(user => {
            let msg = req.flash('error');
            if(msg.length > 0 )
              msg = msg[0];
              else msg = null;
                 res.render('auth/new-password', 
                 { path: '/new-password',
                  title: 'New Password',
                   userId: user._id.toString(),
                   passwordToken: token,
                  error: msg
                 }
                  );
      })
})

app.get('/reset',(req,res,next) => {
   let msg = req.flash('error');
   if(msg.length > 0 )
     msg = msg[0];
     else msg = null;
     console.log(msg);
   res.render('auth/reset', {
         path: '/reset',
         title: 'Reset Password',
         error: msg,
   })
})

app.post('/reset',(req,res,next) => {
   crypto.randomBytes(32,(err,buffer) => {
         if(err) {
               console.log(err);
               return res.redirect('/reset');
         }
         const token = buffer.toString('hex');
         UserModel.findOne({email: req.body.email})
         .then(user => {
               if(!user) {
                     req.flash('error', 'No account with this email');
                     console.log("YEs");
                     return res.redirect('/reset');
               }
               user.resetToken = token;

               user.resetTokenExpiration = Date.now()+360000;
               return user.save();

         }).then(result => {
            console.log(result);
            req.flash('error', 'Check your email');
               res.redirect('/login');
          return transporter.sendMail({
                to: req.body.email,
                from: 'prerna.singh587@gmail.com',
                subject: 'Password reset',
                html: `
                      <p>You requested a password reset</p>
                      <p>Click this <a href="http://localhost:8080/reset/${token}"> link </a> to set a new password </p>
                      <p>Make sure you do it now, the link will expire after 1 hour</p>
                      ` 
          })
          
         })
         .catch(err => console.log(err));
   })
})



app.post('/new-password',(req,res,next) => {
   const newPassword = req.body.password;
   const userId = req.body.userId;
   const passwordToken = req.body.passwordToken;
   let resetUser;
UserModel.findOne({resetTokenExpiration: {$gt: Date.now()}, resetToken: passwordToken, _id: userId})
.then(user => {
resetUser = user;
return bcrypt.hash(newPassword,12)

})
.then(hashedPassword => {
resetUser.password = hashedPassword;
resetUser.resetToken = undefined;
resetUser.resetTokenExpiration = undefined;
return resetUser.save();
})
.then(resu => {
res.redirect('/login');
})
.catch(err => {
console.log(err);
})

})


app.use((req,res,next) => {
   res.status(404).send("Page Not Found");
})


mongoose.connect('mongodb+srv://Prerna:papa2000@cluster0.vw5ul.mongodb.net/CodeWorld?retryWrites=true&w=majority')
.then(result => {
Ques.findOne().then(ques => {
   if(!ques) {
      const ques = new Ques( {
         array: [],
         strings: [],
         stacks: [],
         queues: [],
         heaps: [],
         graphs: [],
         trees: [],
         sorting: [],
         searching: [],
         greedy:[],
         dp: [],
         hashing: [],
         bit: [],
         misc: [],
      });
      ques.save();
   } 
   Contest.findOne().then(result => {
      if(!result)
      {
         const contest = new Contest({
            upcoming: [],
            past: []
         })
         contest.save();
      }
     
      app.listen(8080);
   }).catch(err => console.log(err));

}).catch(err => {
   console.log(err);
})

})
