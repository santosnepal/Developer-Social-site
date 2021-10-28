const express  = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//@route  POST api/posts
//@desc   Create a post
//@access Private 
router.post('/',[auth,[
    check('text','Text Is Required').not().isEmpty()
]],async (request,response )=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(request.user.id).select('-password');
        const newPost = new Post({
            text:request.body.text,
            name:user.name,
            avatar:user.avatar,
            user:request.user.id
        })
        const post = await newPost.save();
        return response.json(post);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send('Server Error');
    }
    
});
//@route  Get api/posts
//@desc   get all posts
//@access Private 
router.get('/',auth,async (request,response)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        return response.json(posts);

    } catch (error) {
        console.log(error.messgae);
        return response.status(500).send("Server Error");
    }
});
//@route  Get api/posts/:pid
//@desc   get  post by id
//@access Private 
router.get('/:pid',auth,async (request,response)=>{
    try {
        const posts = await Post.findById(request.params.pid);
        if(!posts){
            return response.status(404).send("No Post Found");
        }
        return response.json(posts);

    } catch (error) {
        console.log(error.messgae);
        if(error.kind==='ObjectId'){
            return response.status(404).send("No Post Found");
        }
        return response.status(500).send("Server Error");
    }
});
//@route  DELETE api/posts/:pid
//@desc   delete  post by id
//@access Private 
router.delete('/:pid',auth,async(request,response)=>{
    try {
        const post = await Post.findById(request.params.pid);
        if(!post){
            return response.status(404).send("Post Not Found");
        }
        //check user
        
        if(post.user.toString() !== request.user.id ){
            return response.status(401).send("Not authorized ");
        }
        await post.remove();
        return response.send("Post deleted")
    } catch (error) {
        console.log(error.message);
        if(error.kind==='ObjectId'){
            return response.status(404).send("No Post Found");
        }
        return response.status(500).send('Server Erorr');
        
    }
});
//@route  PUT api/posts/like/:pid
//@desc   Like a Post
//@access Private 
router.put('/like/:pid',auth,async(request,response)=>{
    try {
        const post = await Post.findById(request.params.pid);
        if(!post){
            return response.status(404).send("Post Not Found");
        }
        if(post.likes.filter(like=> like.user.toString() === request.user.id).length>0){
            return response.status(400).json({msg:'Post already liked'})
        }
        post.likes.unshift({user:request.user.id});
        await post.save();
        response.json(post.likes);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send("Server Error");
    }
});
//@route  PUT api/posts/unlike/:pid
//@desc   UnLike a Post
//@access Private 
router.put('/unlike/:pid',auth,async(request,response)=>{
    try {
        const post = await Post.findById(request.params.pid);
        if(!post){
            return response.status(404).send("Post Not Found");
        }
        if(post.likes.filter(like=> like.user.toString() === request.user.id).length===0){
            return response.status(400).json({msg:'Post is not  liked'})
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(request.user.id)
        post.likes.splice(removeIndex,1)
        await post.save();
        response.json(post.likes);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send("Server Error");
    }
});
//@route  POST api/posts/comment/:id
//@desc   Comment on  a post
//@access Private 
router.post('/comment/:id',[auth,[
    check('text','Text Is Required').not().isEmpty()
]],async (request,response )=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(request.user.id).select('-password');
        const post = await Post.findById(request.params.id);
        const newComment = {
            text:request.body.text,
            name:user.name,
            avatar:user.avatar,
            user:request.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        return response.json(post);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send('Server Error');
    }
    
});
//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete a Comment
//@access private
router.delete('/comment/:id/:comment_id',auth,async(request,response)=>{
    try{
        const post  = await Post.findById(request.params.id);
        const comment = post.comments.find(comment=>comment.id===request.params.comment_id);
        if(!comment){
            return response.status(404).json({msg:'Comment does not exist'})
        }
        if(comment.user.toString() !== request.user.id){
            return response.status(401).json({msg:'Not authorized'})
        }
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(request.user.id)
        post.comments.splice(removeIndex,1)
        await post.save();
        response.json(post.comments);
    }catch(error){
        console.log(error.message)
        response.status(500).send('Server Error');
    }
});
module.exports = router;