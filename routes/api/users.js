const express  = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//@route  POST api/users
//@desc   Register User
//@access Public 
router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Please Provide a Valid Email').isEmail(),
    check('password','Password Must Be 8 character Long Minimum').isLength({min:6})
],async (request,response )=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});
    }
    
    //see if user exits and add in db if not exists with a hashed password
    const {name,email,password} = request.body;
    try{
        let user = await User.findOne({email});
        if(user){
            console.log(user)
           return response.status(400).json({errors:[{msg:'user already exists'}]});
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        try{
            await user.save();
            //Return jsonwebtoken
            const payload ={
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,
                config.get('jwtSecret'),
                {expiresIn:36000000000},
                (error,token)=>{
                    if(error) throw error;
                   return response.json({token});
                });
            // return response.status(200).send('User Registered');
        }catch(err){
            return response.status(500).send('Cannot Save a new user');
        }
        //await user.save()
    }catch(err){
        console.log(err);
        response.status(500).send('Server Error');

    }
    

   

    
    
});
module.exports = router;