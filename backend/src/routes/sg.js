import express from'express';
import multer from 'multer'
import Users from '../../schema/User.js'
import SG from '../../schema/Sg.js';
import verify from '../middleware/verify.js'

import {body,param,validationResult} from 'express-validator';
import Post from '../../schema/Post.js';
import Report from '../../schema/Report.js';

const router=express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.use(express.json());

router.post('/create',
verify, 
upload.single('image'),
async(req,res)=>{
    try {
        const tags=req.body.tags.split(" ")
        const banned=req.body.banned.split(" ")
        const sg= new SG({
            mod:req.id,
            name:req.body.name,
            desc:req.body.desc
        })
        for (let index = 0; index < tags.length; index++) {
            const element = tags[index];
            sg.tags.push(element);
        }
        if(req.banned){
            for (let index = 0; index < banned?.length; index++) {
                const element = banned[index];
                sg.banned.push(element);
            }
        }
        
        sg.followers.push(req.id);
        sg.prev_users.push(req.id);
        if(req.file){
            sg.img.data=req.file.buffer}
        const mgErrors = sg.validateSync();
        if (mgErrors) {
          return res.status(400).send(mgErrors.message);
        }

        const total=sg.followers.length
        const timestap=new Date()
        let date=[timestap.getDate(),timestap.getMonth()+1,timestap.getFullYear()].join('/')
        sg.user_growth.push({count:total,time:date})
        
        
        await sg.save();
        return res.send(sg);
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
/** 
 * Number of people in the Sub Greddiit
 * Number of posts posted in the Sub Greddiit until now
 * Name
 * Desc
 * banned
*/

router.get('/mysgs',verify,
async(req,res)=>{ 
    try {
        const id=req.id;
        const sgs= await SG.find({mod:id})
        // .select("name banned desc")
        const sg_fls= new Array();
        const sg_psts= new Array();
        for (let i = 0; i < sgs.length; i++) {
            sg_fls.push(sgs[i].totalFollowers())
            // console.log(sgs[i].totalFollowers())
            
        }
        for(let i=0;i<sgs.length;i++){
            sg_psts.push(sgs[i].posts.length);
        }
        // console.log('fls',sg_fls.length)
        const respose={
            // direct:sgs.select("name banned"),
          sg_fls,
            sg_psts,
            sgs
        }
        return res.send(respose);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.post('/del',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        }

        //deleting all posts
        const posts=await Post.find({sg:id})
        for( let i=0;i<posts.length;i++){
            //deleting saved posts
            const users_saves=await Users.find({saved_posts:posts[i]._id})
            for(let j=0;j<users_saves.length;j++){
                const index = users_saves[j].saved_posts.indexOf(posts[i]._id);
                if (index > -1) {
                    users_saves[j].saved_posts.splice(index, 1);
                }
                await users_saves[j].save()
            } 
            //delete all reports
            await Report.deleteMany({post:posts[i]._id})
            await Post.deleteOne({_id:posts[i]._id})
        }

        const deleted=await SG.deleteOne({_id:id});
        return res.send({deleted})
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        // console.log(sg.mod,req.id);
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        }
        return res.send(sg);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/joined',
verify,
async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        // verify has joined
        if(!sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Haven't joined this SG"}]})
        }
        //if banned
        if(sg.blocked_users?.includes(req.id)){
            const index = sg.blocked_users.indexOf(req.id);
            if (index > -1) {
                sg.blocked_users.splice(index, 1);
            }
            return res.status(400).send({errors: [{msg: "Have been banned from the SG"}]})
        }
        return res.send({
            sg,
            user_id:req.id
        });
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/users',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const users=Array()
        const blocked=Array()
        for(let i=0; i<sg.followers.length;i++){
            const user=await Users.findById(sg.followers[i]).select('uname');
            users.push(user);
        }
        for(let i=0; i<sg.blocked_users.length;i++){
            const user=await Users.findById(sg.blocked_users[i]).select('uname');
            blocked.push(user);
        }

        return res.send({users,blocked});
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/reqs',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const req_users=Array()
        for(let i=0; i<sg.req_users.length;i++){
            const user=await Users.findById(sg.req_users[i]);
            req_users.push(user);
        }
        return res.send({req_users});
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/accept',verify,async(req,res)=>{
    try {
        const {id,user_id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const new_user= await Users.findById(user_id)
        if(!new_user){
            return res.status(400).send({errors: [{msg: "User not found"}]})
        }
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        sg.followers.push(user_id);
        sg.prev_users.push(user_id);
        const index = sg.req_users.indexOf(user_id);
        if (index > -1) {
            sg.req_users.splice(index, 1);
        }

        //storing stats
        const total=sg.followers.length
        const timestap=new Date()
        let date=[timestap.getDate(),timestap.getMonth()+1,timestap.getFullYear()].join('/')
        const i=sg.user_growth?.findIndex(e=>e.time===date)
        if(i>-1){
            sg.user_growth[i].count=total
        }
        else{
            sg.user_growth.push({count:total,time:date})
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/reject',verify,async(req,res)=>{
    try {
        const {id,user_id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        const index = sg.req_users.indexOf(user_id);
        if (index > -1) {
            sg.req_users.splice(index, 1);
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/mod/stats/:id',
verify,
async(req,res)=>{
    try{
        const sg_id=req.params.id
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };

        const data={
            user:sg.user_growth,
            post:sg.post_growth,
            vis:sg.visits,
            report:sg.report_stats
        }
        
        // while (dt <= creation_date) {
        //     for(let i=curr;i<sg.user_growth?.length;i++){

        //     }
        //     data.push([new Date(dt),followers]);
        //     dt.setDate(dt.getDate() + 1);
        // }

        return res.send(data)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/request',verify,async(req,res)=>{
    try {
        const user_id=req.id;
        const {sg_id}=req.body;
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        };
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        if(sg.req_users.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Request already sent"}]})
        }
        if(sg.prev_users.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Once leaft, you cannot enter :/"}]})
        }
        sg.req_users.push(user_id)
        await sg.save();
        return
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/sgs',verify,
async(req,res)=>{ 
    try {
        const id=req.id;
        const joined_sg= await SG.find({followers:id})
        const other_sg= await SG.find({followers:{$ne: id}})

        //storing date of creation
        const joined_sg_dates=[]
        const other_sg_dates=[]
        for (let index = 0; index < joined_sg.length; index++) {
            joined_sg_dates[index]= joined_sg[index]._id.getTimestamp();
        }
        for (let index = 0; index < other_sg.length; index++) {
            other_sg_dates[index]= other_sg[index]._id.getTimestamp();
        }
        const response={
            userID:id,
            joined_sg,
            joined_sg_dates,
            other_sg,
            other_sg_dates
        }
        return res.send(response);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/sgs/leave',verify,async(req,res)=>{
    try {
        const {sg_id}=req.body;
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id==req.id){
            return res.status(400).send({errors: [{msg: "Moderator can't leave the SG !"}]})
        };
        if(!sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined this SG"}]})
        }
        if(!sg.prev_users.includes(req.id)){
            sg.prev_users.push(req.id);
        }

        const index = sg.followers.indexOf(req.id);
        if (index > -1) {
            sg.followers.splice(index, 1);
        }
        await sg.save()

        //removing saved posts from this sg
        const user=await Users.findById(req.id)
        for(let i=0;i<user?.saved_posts?.length;i++){
            const post=await Post.findById(user.saved_posts[i],'sg');
            if(post.sg===sg_id){
                const index = user.saved_posts[i].indexOf(req.id);
                if (index > -1) {
                    user.saved_posts[i].splice(index, 1);
                    i-=1
                }
            }
        }
        await user.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/sgs/visitedSG',verify,async(req,res)=>{
    try {
        const {sg_id}=req.body;
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(!sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined this SG"}]})
        }
        
        const timestap=new Date()
        let date=[timestap.getDate(),timestap.getMonth()+1,timestap.getFullYear()].join('/')
        const total=1
        const index=sg.visits?.findIndex(e=>e.time===date)
        if(index>-1){
            sg.visits[index].count+=1
        }
        else{
            sg.visits.push({count:total,time:date})
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});


export default router;