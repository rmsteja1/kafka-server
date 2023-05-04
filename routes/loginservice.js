const bcrypt = require('bcrypt');
const Users = require('../models/User');


function handle_request(customerDetails, callback){
   
    console.log("Inside customerProfile kafka backend");
    const {email, password} = customerDetails;


    if(customerDetails){
        Users.findOne({email: email}, async (err, data) => {
            if(err) callback(null, "Error");
            else {
              if(!data) callback(null, "Incorrect Email ID");
              else {
                const comparision = await bcrypt.compare(password, data.password);
                if(comparision)
                {
                                        
                    callback(null, data) 
                }
                else callback(null, "Incorrect password");                
              }       
            }
          })
    }

    console.log("after callback");
};

exports.handle_request = handle_request;