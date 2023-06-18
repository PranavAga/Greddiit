import express from'express';
import verify from '../middleware/verify.js'

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
})

export default router;
