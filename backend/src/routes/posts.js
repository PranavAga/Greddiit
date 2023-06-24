import express, { response } from'express';
import verify from '../middleware/verify.js'
import {body,validationResult} from 'express-validator';

import Users from '../../schema/User.js'
import SG from '../../schema/Sg.js';
import Post from '../../schema/Post.js';
import Followspair from '../../schema/UserFF.js';

const router=express.Router();
router.use(express.json());

router.post('/create',
body('title').not().isEmpty(),
body('content').not().isEmpty(),
verify,
async(req,res)=>{
    try{
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()});
        }
        const {title,content,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers post_growth')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        const post=new Post({
            creator: req.id,
            sg: sg_id,
            title: title,
            content: content
        })
        await post.save()

        const total=1
        const timestap=new Date()
        let date=[timestap.getDate(),timestap.getMonth()+1,timestap.getFullYear()].join('/')
        const i=users_sg.post_growth?.findIndex(e=>e.time===date)
        if(i>-1){
            users_sg.post_growth[i].count=total
        }
        else{
            users_sg.post_growth.push({count:total,time:date})
        }
        
        await users_sg.save();
        return res.send()

    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/upvote',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        if(post.up_votes.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Already upvoted"}]})
        }
        if(post.down_votes.includes(req.id)){
            const index = post.down_votes.indexOf(req.id);
            if (index > -1) {
                post.down_votes.splice(index, 1);
            }
        }

        post.up_votes.push(req.id)
        await post.save()

        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/remupvote',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        if(!post.up_votes.includes(req.id)){
            return res.status(400).send({errors: [{msg: "not upvoted"}]})
        }
        const index = post.up_votes.indexOf(req.id);
        if (index > -1) {
            post.up_votes.splice(index, 1);
        }
        await post.save()

        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/downvote',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        if(post.down_votes.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Already downvoted"}]})
        }
        if(post.up_votes.includes(req.id)){
            const index = post.up_votes.indexOf(req.id);
            if (index > -1) {
                post.up_votes.splice(index, 1);
            }
        }
        post.down_votes.push(req.id)
        await post.save()

        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/remdownvote',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        if(!post.down_votes.includes(req.id)){
            return res.status(400).send({errors: [{msg: "not downvoted"}]})
        }
        const index = post.down_votes.indexOf(req.id);
        if (index > -1) {
            post.down_votes.splice(index, 1);
        }
        await post.save()

        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/getall/:id',
verify,
async(req,res)=>{
    try{
        const sg_id=req.params.id
        const users_sg=await SG.findById(sg_id).select('followers')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        
        const posts=await Post.find({sg: sg_id}).populate('creator','uname')
        return res.send(posts)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/addcomment',
body('comment').not().isEmpty(),
verify,
async(req,res)=>{
    try{
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()});
        }

        const {comment,post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        const user_id=req.id
        post.comments.push({user_id,text:comment})

        await post.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/getallcomments/:id',
verify,
async(req,res)=>{
    try{
        const post_id=req.params.id
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        const comment_details=[]
        for(let i=0;i<post.comments?.length;i++){
            const usname=await Users.findById(post.comments[i].user_id,'uname')
            const text=post.comments[i].text
            comment_details.push({usname,text})
        }
        
        return res.send(comment_details)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/savepost',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        const user_id=req.id
        const user=await Users.findById(user_id)
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        //already saved
        if(user.saved_posts.includes(post_id)){
            return res.status(400).send({errors: [{msg: "Already saved"}]})
        }

        user.saved_posts.push(post_id)

        await user.save()
        return res.send(user.saved_posts)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/unsavepost',
verify,
async(req,res)=>{
    try{
        const {post_id}=req.body
        const post=await Post.findById(post_id)
        const users_sg=await SG.findById(post.sg).select('followers')
        const user_id=req.id
        const user=await Users.findById(user_id)
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        //already saved
        if(!user.saved_posts.includes(post_id)){
            return res.status(400).send({errors: [{msg: "Not saved"}]})
        }

        const index = user.saved_posts.indexOf(post_id);
        if (index > -1) {
            user.saved_posts.splice(index, 1);
        }

        await user.save()
        return res.send(user.saved_posts)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/getsavedposts/:id',
verify,
async(req,res)=>{
    try{
        const sg_id=req.params.id
        const users_sg=await SG.findById(sg_id).select('followers')
        const user_id=req.id
        const user=await Users.findById(user_id)
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joined the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined the SG"}]})
        }
        
        return res.send(user.saved_posts)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/getusersavedposts',
verify,
async(req,res)=>{
    try{
        const user_id=req.id
        const user=await Users.findById(user_id)
        const posts=[]
        
        for(let i=0;i<user.saved_posts.length;i++){
            const post=await Post.findById(user.saved_posts[i]).populate('creator','uname').populate('sg','banned')

            const sg=await SG.findById(post.sg)
            if(sg.followers.includes(user_id)){
                posts.push(post)
            }
        }

        return res.send({user_id,posts})
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/follow-creator',
verify,
async(req,res)=>{
    try{
        const {creator_id}=req.body
        const user_id=req.id
        
        const flsp=await Followspair.find({curr_user:user_id,follows:creator_id}).exec()
        //cant follow yourself
        if(creator_id===req.id){
            return res.status(400).send({errors: [{msg: "Cant follow yourself"}]})
        }
        //already following
        if(flsp?.length!==0){
            return res.status(400).send({errors: [{msg: "Already follow the creator"}]})
        }
 
        const new_flsp= new Followspair({
            curr_user:req.id,
            follows:creator_id
        })
        await new_flsp.save()

        const following=await Followspair.find({curr_user:req.id}).select('follows');
        return res.send(following)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
export default router;
