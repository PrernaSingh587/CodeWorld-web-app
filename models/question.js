const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Question = new Schema ({
    array : [{link: {type: String, required: true}, date: {type: String, required: true}, userid: {type:String, required: true} }],
   
    strings : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    stacks :  [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    queues : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    heaps : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    graphs :[{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    trees :  [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    sorting : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    searching : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    dp :[{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

   greedy :[{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    hashing :  [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    bit :[{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],

    misc : [{link: {type: String, required: true}, date: {type: String, required: true},  userid: {type:String, required: true} }],



})

Question.methods.addQues = function(ques,topic,date,name){
    let item = [];
    if(topic === 'arrays')
    { 
        item=[...this.array];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.array=item;
        console.log(this.array);
       
    }
  else  if(topic === 'strings')
    { 
        item=[...this.strings];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.strings=item;
        console.log(this.strings);
       
    }
      else  if(topic === 'stacks')
    { 
        item=[...this.stacks];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.stacks=item;
        console.log(this.stacks);
       
    }
    else  if(topic === 'queues')
    { 
        item=[...this.queues];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.queues=item;
        console.log(this.queues);
       
    }
    else  if(topic === 'heaps')
    { 
        item=[...this.heaps];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.heaps=item;
        console.log(this.heaps);
       
    }

    else  if(topic === 'trees')
    { 
        item=[...this.trees];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.trees=item;
        console.log(this.trees);
       
    }
    else  if(topic === 'graphs')
    { 
        item=[...this.graphs];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.graphs=item;
        console.log(this.graphs);
       
    }
    else  if(topic === 'sorting')
    { 
        item=[...this.sorting];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.sorting=item;
        console.log(this.sorting);
       
    }
    else  if(topic === 'searching')
    { 
        item=[...this.searching];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.searching=item;
        console.log(this.searching);
       
    }
    else  if(topic === 'dp')
    { 
        item=[...this.dp];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.dp=item;
        console.log(this.dp);
       
    }
    else  if(topic === 'greedy')
    { 
        item=[...this.greedy];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.greedy=item;
        console.log(this.greedy);
       
    }
    else  if(topic === 'hashing')
    { 
        item=[...this.hashing];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.hashing=item;
        console.log(this.hashing);
    }
    else  if(topic =='misc')
    { 
        item=[...this.misc];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.misc=item;
        console.log(this.misc);
    }
    else  if(topic === 'bit')
    { 
        item=[...this.bit];
        
        const obj = {
            link: ques,
            date : date,
            userid: name
        }
        item.push(obj);
       
        this.bit=item;
        console.log(this.bit);
    }
   return this.save();

}

module.exports = mongoose.model('Question', Question);