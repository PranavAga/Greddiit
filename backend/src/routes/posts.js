import express, { response } from'express';
import verify from '../middleware/verify.js'
import {body,validationResult} from 'express-validator';

import Users from '../../schema/User.js'
import SG from '../../schema/Sg.js';
import Post from '../../schema/Post.js';

const router=express.Router();
router.use(express.json());

router.post('/create',
verify,
async(req,res)=>{
    try{
        const {title,content,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers')
        
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
        }
        const post=new Post({
            creator: req.id,
            sg: sg_id,
            title: title,
            content: content
        })
        await post.save()
        //check for banned words
        const hasBanned=false
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
        const {post_id,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers')
        const post=await Post.findById(post_id)
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
        const {post_id,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers')
        const post=await Post.findById(post_id)
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
        const {post_id,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers')
        const post=await Post.findById(post_id)
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
        const {post_id,sg_id}=req.body
        const users_sg=await SG.findById(sg_id).select('followers')
        const post=await Post.findById(post_id)
        //if SG doesnt exists
        if(!users_sg){
            return res.status(400).send({errors: [{msg: "SG doesn't exits"}]})
        }
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
        }
        
        const posts=await Post.find({sg: sg_id})
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
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
        //if user hasn't joinned the SG
        if(!users_sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joinned the SG"}]})
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
export default router;
