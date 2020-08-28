const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateSignUp(data) 
{
    let errors = {};
    console.log("==>",data);
    
    //  convert empty fields to string so as to use validator functions

     data.username = !isEmpty(data.username) ? data.username : "";
     data.email = !isEmpty(data.email) ? data.email : "";
     data.password = !isEmpty(data.password) ? data.password : "";

    //  username checks
     if(Validator.isEmpty(data.username)){
         errors.username = "Name field is required";
     }
    //  Email checks
     if(Validator.isEmpty(data.email)){
         errors.email = "Email is required";
     } else if(!Validator.isEmail(data.email)){
         errors.email = "Email is invalid";
     }

    //  Password Checks
     if(Validator.isEmpty(data.password)){
         errors.password = "Password is required";
     }
     if(!Validator.isLength(data.password, {min: 5, max: 30})){
         errors.password = "Password must be atleast 5 characters";
     }


     return {
         errors,
         isValid: isEmpty(errors)
     };
};