const express  = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');
const { response } = require('express');
const requests = require('request');
const config = require('config');
//@route  GET api/profile/me
//@desc   Get current users profile
//@access Private 
router.get('/me',auth,async(request,response )=>{
    try{
        const profile = await Profile.findOne({user:request.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return response.status(500).json({msg:"There is No Profile for This user"});
        }
        response.json(profile)
    }catch(err){
        console.log(err.message);
        response.status(500).send('Server Error')
    }
});
//@route  POST api/profile
//@desc   Create Or update user profie
//@access Private 

router.post('/',[auth,
    [check('status','Status is Required ').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],async(request,response)=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});
    }
    const 
    {company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
    } = request.body;
    //Buid Profile Object
    const profilefields = {};
    profilefields.user = request.user.id;
    if(company) profilefields.company = company;
    if(website) profilefields.website = website;
    if(location) profilefields.location = location;
    if(bio) profilefields.bio = bio;
    if(status) profilefields.status = status;
    if(githubusername) profilefields.githubusername = githubusername;
    if(skills){
        profilefields.skills = skills.split(',').map(skill=>skill.trim());

    }
    profilefields.social = {}
    if(youtube) profilefields.social.youtube = youtube;
    if(twitter) profilefields.social.twitter = twitter;
    if(facebook) profilefields.social.facebook = facebook;
    if(linkedin) profilefields.social.linkedin =linkedin;
    if(instagram) profilefields.social.instagram = instagram;
    try{
        let profile = await Profile.findOne({user:request.user.id});
        if(profile){
            //update profile
            profile = await Profile.findOneAndUpdate(
                {user:request.user.id},
                {$set:profilefields},
                {new:true}
                );
                return response.json(profile);
        }
        //create
        profile = new Profile(profilefields);
        await profile.save();
        return response.json(profile);
    }catch(err){
        console.log(err.message);
        return response.status(500).send('Server Error');
    }
    
    

})

//@route GET api/profile
//@desc Get all profiles
//@access Public
router.get('/',async (req,res)=>{

    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        if(!profiles){
            return res.status(404).json({msg:'here are no profile'});
        }
        return res.status(200).json(profiles);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');
        
    }
})


//@route GET api/profile/user/:user_id
//@desc Get Profile By user id
//@access Public
router.get('/user/:user_id',async (req,res)=>{

    try {
        const profiles = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profiles){
            return res.status(404).json({msg:'There are no profile for this user'});
        }
        return res.status(200).json(profiles);
    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg:'There are no profile for this user'}); 
        }
        return res.status(500).send('Server Error');
        
    }
})
//@route Delete api/profile
//@desc Delete profile , user & posts
//@access Private
router.delete('/',auth,async (req,res)=>{

    try {
        //Remove Profile
        //@todo-remove user posts
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove User
        
        await User.findOneAndRemove({_id:req.user.id});
        
        return res.status(200).json({msg:'user Removed'});
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).send('Server Error');
        
    }
});
//@route PUt api/profile/experince
//@desc Add Profile Experince
//@access Private
router.put('/experince',[auth,[
    check('title','Title is Required').not().isEmpty(),
    check('company','Company is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty(),

]],async(request,response)=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});

    }
    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = request.body;
    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:request.user.id});
        profile.experience.unshift(newExp);
        //console.log(profile);
        await profile.save();
        return response.json(profile);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send('Server Error');
        
    }

});
//@route DELETE api/profile/experince/:exp_id
//@desc Delete Profile Experince
//@access Private
router.delete('/experince/:exp_id',auth,async(request,response)=>{
    try {
        const profile = await Profile.findOne({user:request.user.id});
        //Get Remove Index
        const removeIndex = profile.experience.map(item=>item.id).indexOf(request.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
       return  response.json(profile);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Server Error');
        
    }
});
//@route PUT api/profile/education
//@desc Add Profile education
//@access Private
router.put('/education',[auth,[
    check('school','School is Required').not().isEmpty(),
    check('degree','degree is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty(),
    check('fieldofstudy','field of study is Required').not().isEmpty()

]],async(request,response)=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});

    }
    const {
        school,
        degree,
        fieldofstudy,
        location,
        from,
        to,
        current,
        description
    } = request.body;
    const newEdu={
        school,
        degree,
        fieldofstudy,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:request.user.id});
        profile.education.unshift(newEdu);
        //console.log(profile);
        await profile.save();
        return response.json(profile);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send('Server Error');
        
    }

});

//@route DELETE api/profile/education/:edu_id
//@desc Delete Profile education
//@access Private
router.delete('/education/:edu_id',auth,async(request,response)=>{
    try {
        const profile = await Profile.findOne({user:request.user.id});
        //Get Remove Index
        const removeIndex = profile.education.map(item=>item.id).indexOf(request.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
       return  response.json(profile);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Server Error');
        
    }
});
//@route GET api/profile/github/:username
//@desc GET user repos
//@access Public
router.get('/github/:username',(request,response)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${request.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node-js'}
        };
        requests(options,(error,res,body)=>{
            if(error) console.log(error);

            if(res.statusCode!==200){
                response.status(400).json({msg:"No GitHub Profile found"});
            }
            return response.json(JSON.parse(body));
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Server Error');
        
    }
});
module.exports = router;