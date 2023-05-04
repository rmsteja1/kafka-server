const Post = require('../models/Post.js');

function handle_request(req, callback){

console.log("handling new post")
  const newPost = new Post(req);
  newPost.save((err, result) =>{
    if(err){
      callback(null, null);
    } else {
        callback(null, result) 
    }
  })

    console.log("after callback");
};

exports.handle_request = handle_request;  