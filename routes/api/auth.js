const express  = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');
//@route  GET api/auth
//@desc   Test Route
//@access Public 
router.get('/',auth,async (request,response )=>{
    try{
        const user = await User.findById(request.user.id).select('-password');
        response.json(user);
    }catch(err){
        console.log(err.message);
        response.status(500).send('server error')
    }
});
//@route POST api/auth
//@desc Authenticate user & get token
//@access public
router.post('/',[
    check('email','Please Provide a Valid Email').isEmail(),
    check('password','Password is Required').exists({min:8})
],async (request,response )=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});
    }
    
    //see if user exits and add in db if not exists with a hashed password
    const {email,password} = request.body;
    try{
        let user = await User.findOne({email});
        if(!user){
           return response.status(400).json({errors:[{message:'Invalid Credentials '}]});
        }
       
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
           return response.status(400).json({erors:[{msg:'Invalid Credentials'}]});
       }
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