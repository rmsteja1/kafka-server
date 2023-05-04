const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const router = express.Router();
const path = require("path");
var connection = new require('./kafka/Connection');

dotenv.config();

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const mongoDB='mongodb+srv://tejaramisetty:cmpe2022211@cluster0.sz9jt.mongodb.net/weTalkDB?retryWrites=true&w=majority';
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {clear
      console.log(err);
      console.log(`MongoDB Connection Failed`);
  } else {
     // auth();
      console.log(`MongoDB Connected`);
  }
});




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

const userRegistration = require('./routes/registerService');
const userLogin = require('./routes/loginservice');
const newpost = require('./routes/newpost');

function handleTopicRequest(topic_name,fname){
  console.log("enter");
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', function (message) {
      console.log('message received for ' + topic_name +" ", fname);
      console.log(JSON.stringify(message.value));
      var data = JSON.parse(message.value);
      
      fname.handle_request(data.data, function(err,res){
          console.log('after handle'+res);
          var payloads = [
              { topic: data.replyTo,
                  messages:JSON.stringify({
                      correlationId:data.correlationId,
                      data : res
                  }),
                  partition : 0
              }
          ];
          console.log("payload is")
          console.log(payloads);
          producer.send(payloads, function(err, data){
              console.log(data);
          });
          return;
      });
      
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("user-register", userRegistration)
handleTopicRequest("user-login", userLogin)
handleTopicRequest("new-post", newpost)


