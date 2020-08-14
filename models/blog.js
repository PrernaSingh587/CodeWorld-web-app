const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blog = new Schema ( {
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userName : {
        type: String,
        ref: "User"
    },
    email: {
        type: String,
        required: true
    },
    like : {
        type:Number,
        required: true
    },
    likeuserid: [{userid: {type: String, required: true}}],
    comment: [{comments: {type: String, required: false}, username: {type: String, required: false ,ref:'User'},
       userid: {type: String, required: false ,ref:'User'} , date: {type: String, required: false}
    }],
    userid : {
        type:String,
        required: true,
        ref: 'User'
    }
    
    
})

Blog.methods.incLike = function (blogid,userid) {
    let array = this.likeuserid;
    let f=-1;
    for(let i=0;i<array.length;i++)
    {
        if(array[i].userid === userid)
        {
            f=i; break;
        }
    }
    if(f>-1) 
    {
        this.like = this.like-1;
        array.splice(f, 1);
        this.likeuserid = array;
    }
    else
   { this.like = this.like+1;
        let user = {
            userid: userid
        }
    array.push(user);
    this.likeuserid = user;
    }
    console.log("incLike," ,this.like);
   return this.save();
}

Blog.methods.docomment = function (comment,username,userid,date) {
   const Commenting = [...this.comment];
   const object = {
       comments : comment,
       username: username,
       date: date,
       userid: userid
   }
   Commenting.push(object);
   this.comment = Commenting;
   return this.save();
}



module.exports = mongoose.model('Blog', Blog);
