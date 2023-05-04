const bcrypt = require('bcrypt');
const Users = require("../models/User");

function handle_request(customerDetails, callback){
   
    console.log("Inside customerProfile kafka backend");
    console.log(customerDetails);
    const {username, email, password ,city, from, relationship} = customerDetails;

    if(customerDetails){
        Users.findOne({email: email}, async (err, cust) => {
            console.log("user find one")
        if(err) callback(null, null);
        else if(cust) callback("error", null);
        else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            var newUser = new Users(
                {
                    username: username,
                    email: email,
                    password: hashPassword,
                    city:city,
                    from :from,
                    relationship:relationship
                  }
            )
            console.log("before saving");
            newUser.save((err, data) => {
                console.log(data);
                console.log(err);
                if(data) callback(null, data)  
                else callback(err, null)
            })
        }
    })

    console.log("after callback");
}
};

exports.handle_request = handle_request;