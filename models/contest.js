const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contest = new Schema( {
    upcoming: [{link: {type: String, required: true }, type: {type: String, required: true}, date: {type: String, required: true}, sTime: {type: String, required:true},eTime: {type: String, required:true}}],
    past: [{link: {type: String, required: true }, type: {type: String, required: true}, date: {type: String, required: true}, duration: {type: String, required:true}}]

})

Contest.methods.addContest = function(link,type,date,sTime,eTime) {
    let item=[];
    item=[...this.upcoming];
    const obj ={
        link: link,
        type: type,
        date: date,
       sTime:sTime,
       eTime:eTime
    };
    item.push(obj);
    this.upcoming = item;
    console.log(this.upcoming);
   return this.save();
}

Contest.methods.addPastContest = function()
{
    
}

module.exports = mongoose.model('Contest', Contest);
